let posts = [];
const PORT = process.env.PORT || 8080;
for (let i = 0; i < 100; i++)
  posts.push({
    id: i,
    title: `Post ${i}`,
    image: i % 3 === 1 ? `http://localhost:${PORT}/media/a.jpg` : false,
    video: `http://192.168.1.103:${PORT}/media/video.mp4`,
  });

let popularPosts = [];

for (let i = 0; i < 100; i++)
  popularPosts.push({
    id: i,
    title: `Popular post ${i}`,
    image: i % 2 === 0 ? `http://localhost:${PORT}/media/a.jpg` : false,
  });

export default function handler(req, res) {
  if (req.method !== "GET") return;
  let { from, amount, type } = req.query;
  from = parseInt(from);
  amount = parseInt(amount);
  let output = [];
  //   Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500);

  if (type === "/popular") {
    for (let i = from; i < from + amount && i < 100; i++) {
      output.push(popularPosts[i]);
    }
  } else if (type === "/") {
    for (let i = from; i < from + amount && i < 100; i++) {
      output.push(posts[i]);
    }
  }
  res.status(200).send({ posts: output, hasMore: amount + from < 99 });
}
