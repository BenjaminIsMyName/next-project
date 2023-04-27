import { $getRoot, $getSelection } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "@l/plugins/ToolbarPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import RestorePlugin from "@l/plugins/RestorePlugin";

const theme = {
  // Theme styling goes here
  ltr: "text-left",
  rtl: "text-right",
  paragraph: "idk",
};

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
// function onChange(editorState) {
//   editorState.read(() => {
//   //   // Read the contents of the EditorState here.
//     const root = $getRoot();
//     const selection = $getSelection();
//     console.log(root, selection);
//   });
// }

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
  console.error(error);
}

function RestoreFromLocalStoragePlugin() {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
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

export default function TextEditor({ editorStateRef }) {
  // const [editor] = useLexicalComposerContext();

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
    // editorState: editorStateRef.current
    //   ? editor.parseEditorState(editorStateRef.current)
    //   : null,
  };

  return (
    <div className="min-h-[320px]">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="editor-inner relative [&_h1]:text-4xl [&_h2]:text-2xl">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[200px] editor-input bg-second-color shadow-inner shadow-shadows-color p-2 text-start" />
            }
            placeholder={
              <div className="absolute top-2 text-start px-2 pointer-events-none">
                Enter some text...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={editorState => {
              editorStateRef.current = JSON.stringify(editorState.toJSON());
            }}
          />
          <HistoryPlugin
          // externalHistoryState={editorStateRef.current?.historyState} // TODO: doesn't work
          />
          <MyCustomAutoFocusPlugin />
          {/* <RestoreFromLocalStoragePlugin /> */}
          <RestorePlugin dataAsJson={editorStateRef.current} />
        </div>
      </LexicalComposer>
    </div>
  );
}
