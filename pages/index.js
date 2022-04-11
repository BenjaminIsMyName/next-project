import Template from "../components/Template";

export default function Home(props) {
  return <Template postsProp={props.posts} />;
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  // query db for posts here.
  // using the next.js api here won't work at build time.
  // so we need to fetch it directly the db.
  // for more info: https://nextjs.org/docs/basic-features/data-fetching/get-static-props#write-server-side-code-directly

  let url = new URL("http://localhost:3000/api/posts");

  let params = {
    from: 0,
    amount: 5,
    type: "/",
  };
  let postData = {};
  url.search = new URLSearchParams(params).toString();
  try {
    let data = await fetch(url);
    postData = await data.json();
  } catch (error) {
    postData.posts = [];
  }
  return {
    props: {
      posts: postData.posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 5 seconds
    revalidate: 5, // In seconds
  };
}
