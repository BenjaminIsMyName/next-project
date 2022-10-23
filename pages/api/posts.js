import connectToDatabase from "../../util/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return;
  // let { from, amount, type } = req.query;
  // from = parseInt(from);
  // amount = parseInt(amount);

  let { exist, amount, type } = req.query;

  const AMOUNT = parseInt(amount);
  const EXIST = JSON.parse(exist);

  // connect to db ------------------------
  try {
    var { db } = await connectToDatabase();
    var posts = await db.collection("posts").find().toArray();
  } catch (err) {
    res.status(503).json({ error: `failed to connect to DB: ${err}` });
    return;
  }

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

  // ------ short version:
  const filteredPosts = posts.filter(p =>
    EXIST.find(i => JSON.stringify(i) === JSON.stringify(p._id)) ? false : true
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

  const getSome = filteredPosts.slice(0, AMOUNT);

  res
    .status(200)
    .send({ posts: getSome, hasMore: filteredPosts.length > AMOUNT });
}

function getNumberOfMinutesPassed(date) {
  let rightNow = new Date();
  const msInMinute = 60 * 1000;
  return Math.round(Math.abs(date - rightNow) / msInMinute);
}
