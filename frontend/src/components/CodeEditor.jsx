import React from 'react';

const CodeEditor = ({ 
  language, 
  value, 
  onChange, 
  placeholder,
  isActive 
}) => {
  return (
    <div className="code-editor" style={{ display: isActive ? 'flex' : 'none' }}>
      <div className="editor-header">
        <span className="editor-title" data-language={language}>{language.toUpperCase()}</span>
      </div>
      <textarea
        className="editor-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  );
};

export default CodeEditor;
