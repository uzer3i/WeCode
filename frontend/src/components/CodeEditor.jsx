import React from 'react';

const CodeEditor = ({ 
  language, 
  value, 
  onChange, 
  placeholder,
  isActive 
}) => {
  // Process text to add data attributes for brackets
  const processTextForBrackets = (text) => {
    let processed = text;
    
    if (language === 'html') {
      // Wrap HTML brackets in spans with data attributes
      processed = text
        .replace(/</g, '<span data-bracket="&lt;">&lt;</span>')
        .replace(/>/g, '<span data-bracket="&gt;">&gt;</span>');
    } else {
      // Wrap curly braces in spans with data attributes
      processed = text
        .replace(/\{/g, '<span data-bracket="{">{</span>')
        .replace(/\}/g, '<span data-bracket="}">}</span>');
    }
    
    return processed;
  };

  return (
    <div className="code-editor" style={{ display: isActive ? 'flex' : 'none' }}>
      <div className="editor-header">
        <span className="editor-title" data-language={language}>{language.toUpperCase()}</span>
      </div>
      <textarea
        className={`editor-textarea ${language}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        dangerouslySetInnerHTML={{ __html: processTextForBrackets(value) }}
        style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          fontFamily: 'Consolas, Monaco, Courier New, monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '15px',
          width: '100%',
          height: '100%',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflow: 'auto'
        }}
      />
    </div>
  );
};

export default CodeEditor;
