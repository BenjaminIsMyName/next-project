import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useCallback, useEffect, useRef } from "react";

export default function RestoreFromLocalStoragePlugin() {
  const [editor] = useLexicalComposerContext();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      const serializedEditorState = localStorage.getItem("editorState");
      if (serializedEditorState) {
        const initialEditorState = editor.parseEditorState(
          serializedEditorState
        );
        editor.setEditorState(initialEditorState);
      }
    }
  }, [isFirstRender, editor]);

  const onChange = useCallback(editorState => {
    localStorage.setItem("editorState", JSON.stringify(editorState.toJSON()));
  }, []);

  return <OnChangePlugin onChange={onChange} />;
}
