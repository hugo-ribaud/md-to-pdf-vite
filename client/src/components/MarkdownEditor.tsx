import React, { useRef } from 'react';

import Editor from '@monaco-editor/react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "# Start typing your Markdown here...\n\nThis is a **live editor** with instant PDF preview!\n\n## Features\n- Syntax highlighting\n- Real-time preview\n- GitHub Flavored Markdown support\n- Tables, code blocks, and more\n\n```javascript\nconsole.log('Hello, World!');\n```\n\n| Feature | Status |\n|---------|--------|\n| Editor | ✅ Working |\n| Preview | ✅ Live |\n| Export | ✅ Ready |",
  disabled = false,
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure Monaco for better Markdown experience
    monaco.languages.setLanguageConfiguration('markdown', {
      wordPattern:
        /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
      brackets: [
        ['[', ']'],
        ['(', ')'],
        ['{', '}'],
      ],
      autoClosingPairs: [
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '{', close: '}' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: '`', close: '`' },
        { open: '**', close: '**' },
        { open: '*', close: '*' },
        { open: '__', close: '__' },
        { open: '_', close: '_' },
      ],
    });

    // Set editor options for better UX
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 1.6,
      wordWrap: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      padding: { top: 16, bottom: 16 },
      lineNumbers: 'on',
      renderLineHighlight: 'gutter',
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: disabled,
      cursorStyle: 'line',
      mouseWheelZoom: true,
      quickSuggestions: false,
      parameterHints: { enabled: false },
      suggestOnTriggerCharacters: false,
      acceptSuggestionOnEnter: 'off',
      tabCompletion: 'off',
      wordBasedSuggestions: 'off',
    });

    // Focus the editor
    if (!disabled) {
      editor.focus();
    }
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  return (
    <div className="h-full border border-border rounded-lg overflow-hidden bg-background">
      <div className="bg-muted/50 px-4 py-2 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            Markdown Editor
          </h3>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Live Preview</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="h-[calc(100%-49px)]">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            automaticLayout: true,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 1.6,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </div>
  );
};
