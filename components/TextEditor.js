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
import RestoreFromLocalStoragePlugin from "@l/plugins/RestoreFromLocalStoragePlugin";
import FocusPlugin from "@l/plugins/FocusPlugin";

const theme = {
  // Theme styling goes here
  ltr: "text-left",
  rtl: "text-right",
  paragraph: "idk",
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
  console.error(error);
}

export default function TextEditor({ editorStateRef }) {
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
          <FocusPlugin />
          {/* <RestoreFromLocalStoragePlugin /> */}
          <RestorePlugin dataAsJson={editorStateRef.current} />
        </div>
      </LexicalComposer>
    </div>
  );
}
