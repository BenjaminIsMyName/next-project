import { useEffect, useMemo, useRef, useState } from "react";
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

  const init = useMemo(
    // the object will always be the same object. same reference.
    () => ({
      loading: true,
      error: null,
      posts: [],
      hasMore: false,
    }),
    []
  );

  const [state, setState] = useState(init);

  const existRef = useRef([]);

  existRef.current = JSON.stringify(state.posts.map(p => p._id));

  useEffect(() => {
    existRef.current = JSON.stringify([]);
    // ^^ this is needed just to make sure existRef is up to date,
    // Removing it will cause issues with posts when log-in or log-out.
    // Because when "query" changes, both effects run. before "setState(init)" happens, and... existRef is not empty yet
    window.scrollTo(0, 0);
    // when we are asking for something else (query changes), delete everything and start from scratch
    setState(init);
  }, [init, query]); // same as: [query]

  if (process.env.NEXT_PUBLIC_HOW_MANY_TO_FETCH === undefined) {
    throw new Error(
      "Environment variable NEXT_PUBLIC_HOW_MANY_TO_FETCH is not defined"
    );
  }

  useEffect(() => {
    const source = axios.CancelToken.source();
    async function forAsync() {
      setState(prev => ({ ...prev, ...{ loading: true, error: null } }));
      try {
        const { data } = await axios.get("/api/posts", {
          params: {
            exist: existRef.current, // see: https://stackoverflow.com/a/63261270/19460851
            amount: process.env.NEXT_PUBLIC_HOW_MANY_TO_FETCH,
            type: JSON.parse(query).type,
            topicId: JSON.parse(query).topicId,
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
      return source.cancel();
    };
  }, [query, forceRender]);

  return state;
}
