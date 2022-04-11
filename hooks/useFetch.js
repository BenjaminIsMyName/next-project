import { useEffect, useState } from "react";
import axios from "axios";
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

      const source = axios.CancelToken.source();
      try {
        const { data } = await axios.get("/api/posts", {
          params: {
            from: from,
            amount: 5,
            type: query,
          },
          cancelToken: source.token,
        });
        setState(prev => ({
          ...prev,
          ...{
            posts: [...state.posts, ...data.posts],
            hasMore: data.hasMore,
            loading: false,
          },
        }));
      } catch (error) {
        if (axios.isCancel(error))
          setState(prev => ({ ...prev, ...{ error: error } }));
      }
      return () => source.cancel();
    }
    return forAsync();
  }, [query, from, forceRender]);
  return state;
}
