import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";

export default function RestorePlugin({ dataAsJson }) {
  const [editor] = useLexicalComposerContext();
  const dataAsJsonRef = useRef(dataAsJson);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!dataAsJsonRef.current) return;
      const initialEditorState = editor.parseEditorState(dataAsJsonRef.current);
      if (initialEditorState.isEmpty()) return;
      editor.setEditorState(initialEditorState);
    }
  }, [editor]);
  return null;
}
