import { useEffect, useState } from "react";

export default function useFetch(query, from, forceRender, posts) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    posts: posts,
    hasMore: false,
  });

  useEffect(() => {
    setState(prev => ({ ...prev, ...{ posts: [] } }));
  }, [query]);

  useEffect(() => {
    async function forAsync() {
      setState(prev => ({ ...prev, ...{ loading: true, error: null } }));

      let controlFetch;
      const controller = new AbortController();
      const { signal } = controller;
      controlFetch = controller;
      var url = new URL("http://localhost:3000/api/posts");

      var params = {
        from: from,
        amount: 5,
        type: query,
      };

      url.search = new URLSearchParams(params).toString();
      try {
        let data = await fetch(url, { signal });
        let postData = await data.json();
        setState(prev => ({
          ...prev,
          ...{
            posts: [...state.posts, ...postData.posts],
            hasMore: postData.hasMore,
            loading: false,
          },
        }));
      } catch (error) {
        if (error.name !== "AbortError")
          setState(prev => ({ ...prev, ...{ error: error } }));
      }
      return () => controlFetch.abort();
    }
    return forAsync();
  }, [query, from, forceRender]);
  return state;
}
