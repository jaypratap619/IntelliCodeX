import { useContext, useEffect, useState } from "react";
// import type { IProjectResponse } from "../../pages/Sandbox";
import { Editor } from "@monaco-editor/react";
import { FileTreeContext } from "../../context/FileTreeContext";

interface File {
  name: string;
  language: string
  value: string
}


// const initialFiles: File[] = [
//   { name: 'index.js', language: 'javascript', value: '// index.js\nconsole.log("Hello World");' },
//   { name: 'style.css', language: 'css', value: '/* style.css */\nbody { margin: 0; }' },
//   { name: 'README.md', language: 'markdown', value: '# README\nWelcome to the project.' }
// ]


const CodeEditor = () => {
  const fileTreeContext = useContext(FileTreeContext);
  if (!fileTreeContext) {
    throw new Error("FileTreeContext is not provided");
  }
  const { fileTreeState, activeFile } = fileTreeContext;
  console.log("fileTreeState", fileTreeState);

  function extractExtension(fileName: string) {
    const obj = {
      js: 'javascript',
      css: 'css',
      html: 'html',
      md: 'markdown'
    };
    const ext = fileName.split('.')[1]
    return obj[ext as keyof typeof obj];
  }

  useEffect(() => {
    setFiles([{ name: activeFile.key, language: extractExtension(activeFile.key), value: activeFile.value}])
  }, [])

  useEffect(() => {
    // setFiles([...files, { name: activeFile.key, language: extractExtension(activeFile.key), value: activeFile.value}])
    files.map((file) => {
      if (file.name != activeFile.key) {
        setFiles([...files, { name: activeFile.key, language: extractExtension(activeFile.key), value: activeFile.value }])
      }
    })

    // setFiles([{ name: activeFile.key, language: extractExtension(activeFile.key), value: activeFile.value}])
  }, [activeFile.key])







  // const [files, setFiles] = useState<File[]>([{ name: activeFile.key, language: extractExtension(activeFile.key), value: activeFile.value }]);
  const [files, setFiles] = useState<File[]>([]);

  const [activeTab, setActiveTab] = useState<number>(0);



  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    const updatedFiles = [...files];
    // console.log("UpdatedFiles:",updatedFiles, activeTab);
    updatedFiles[activeTab].value = value;
    setFiles(updatedFiles);
  }

  const handleCloseTab = (index: number) => {
    console.log("Index: ", index, activeTab);
    const newFiles = files.filter((_, i) => i != index);
    setFiles(newFiles);

    if (index === activeTab) {
      // Close the current Tab and move to the previous tab if exist else move to first
      setActiveTab(index > 0 ? index - 1 : 0);
    }
  }

  return (
    <div className=" h-[650px] flex flex-col">
      {/* Tabs */}
      <div className="flex space-x-4 border-gray-300 mb-2 overflow-x-auto">
        {files.map((file, index) => (
          <div
            key={file.name}
            className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-t ${index === activeTab ? 'bg-white border border-b-0 border-gray-300 text-blue-600' : 'text-gray-600 bg-gray-100'
              }`}
          >
            <button onClick={() => setActiveTab(index)}>{file.name}</button>
            <button
              className="text-gray-500 hover:text-red-600 ml-2"
              onClick={() => handleCloseTab(index)}
            >
              x
            </button>
          </div>
        ))}
      </div>

      {/* Editor */}
      {files.length > 0 ? (
        <div className="flex-1">
          <Editor
            height="100%"
            value={activeFile.value}
            language={files[activeTab].language}
            theme="vs-dark"
            onChange={handleEditorChange}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
          No files open. Please add a new file.
        </div>
      )}
    </div>
  )
}

export default CodeEditor;