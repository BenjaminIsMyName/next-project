import { getCookie } from "cookies-next";
import { isLoggedInFunc } from "../../util/authHelpers";
import connectToDatabase from "../../util/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return;
  // let { from, amount, type } = req.query;
  // from = parseInt(from);
  // amount = parseInt(amount);

  let { exist, amount, type } = req.query;

  const AMOUNT = parseInt(amount);
  const EXIST = JSON.parse(exist);
  // let userFromCookie = getCookie("user", { req, res });
  // userFromCookie = userFromCookie ? JSON.parse(userFromCookie) : null;

  const { isLoggedIn, user } = await isLoggedInFunc(req, res);

  // Fetch posts:
  try {
    const { db } = await connectToDatabase();
    var posts = await db.collection("posts").find().toArray();
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `failed to get posts from DB: ${err}` });
    return;
  }

  // Simple algorithm to sort the posts based on the time and likes:
  posts.sort((a, b) => {
    let scoreA = 0;
    scoreA -= getNumberOfMinutesPassed(a.postCreationDate);
    scoreA += a.likes.length;

    let scoreB = 0;
    scoreB -= getNumberOfMinutesPassed(b.postCreationDate);
    scoreB += b.likes.length;

    if (scoreA < scoreB) return 1;
    else if (scoreA > scoreB) return -1;
    else return 0;
  });

  // Remove posts that are already on the client side:
  // ------ short version:
  const filteredPosts = posts.filter(
    p => (EXIST.find(i => p._id.equals(i)) ? false : true) // see about 'equals': https://futurestud.io/tutorials/mongodb-how-to-compare-objectids-in-node-js
  );
  // ------ long version:
  // const filteredPosts = [];
  // for (let i = 0; i < posts.length; i++) {
  //   let isExist = false;
  //   for (let j = 0; j < EXIST.length; j++) {
  //     if (JSON.stringify(posts[i]._id) === JSON.stringify(EXIST[j])) {
  //       isExist = true;
  //       break;
  //     }
  //   }
  //   if (!isExist) filteredPosts.push(posts[i]);
  // }

  // Send only some of the posts, the amount that was requested
  const getSome = filteredPosts.slice(0, AMOUNT);

  // Remove unnecessary data, show "didLike" if user is logged in etc
  const customize = getSome.map(p => {
    return {
      _id: p._id,
      url: p.url,
      type: p.type,
      title: p.title,
      postCreationDate: p.postCreationDate,
      uploaderId: p.uploaderId,
      numberOfComments: p.comments.length,
      numberOfLikes: p.likes.length,
      topics: p.topics,
      didLike: isLoggedIn
        ? p.likes.find(userId => userId.equals(user._id))
          ? true
          : false
        : false,
    };
  });
  res
    .status(200)
    .send({ posts: customize, hasMore: filteredPosts.length > AMOUNT });
}

function getNumberOfMinutesPassed(date) {
  let rightNow = new Date();
  const msInMinute = 60 * 1000;
  return Math.round(Math.abs(date - rightNow) / msInMinute);
}
