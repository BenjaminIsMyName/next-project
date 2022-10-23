import { useEffect, useState } from "react";
import axios from "axios";
export default function useFetch(query, forceRender) {
  // this is a custom hook that uses the axios library to fetch data from the server.
  // it returns an object with a few properties: loading, error, posts, and hasMore.
  // at first, the function will return the default values for these properties.
  // then, it will fetch the data in useEffect and update the state.
  // this will cause the hook to re-render itself, and the component that uses it will get new data and re-render too.
  // a custom hook is a function that holds some state. the component that uses it is going to behave as if the logic is inside of it.
  // https://stackoverflow.com/questions/56345853/should-custom-react-hooks-cause-re-renders-of-dependent-components
  // https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook

  const [state, setState] = useState({
    loading: true,
    error: null,
    posts: [],
    hasMore: false,
  });

  useEffect(() => {
    const source = axios.CancelToken.source();
    async function forAsync() {
      setState(prev => ({ ...prev, ...{ loading: true, error: null } }));
      try {
        const { data } = await axios.get("/api/posts", {
          params: {
            exist: JSON.stringify(state.posts.map(p => p._id)),
            amount: 2,
            type: query,
          },
          cancelToken: source.token,
        });
        setState(prev => ({
          ...prev,
          ...{
            posts: [...prev.posts, ...data.posts],
            hasMore: data.hasMore,
            loading: false,
          },
        }));
      } catch (error) {
        if (!axios.isCancel(error))
          setState(prev => ({ ...prev, ...{ error: error } }));
      }
    }
    forAsync();
    return () => {
      // TODO: check bug, this is called right away?
      return source.cancel();
    };
  }, [query, forceRender]); // It seems like eslint suggestion to add state.posts is not good, and in this case - the code is perfectly fine as it is.

  return state;
}
