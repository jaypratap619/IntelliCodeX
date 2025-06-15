/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
// import type { IProjectResponse } from "../../pages/Sandbox";
import { Editor } from "@monaco-editor/react";
import { FileTreeContext } from "../../context/FileTreeContext";

interface File {
  name: string;
  language: string
  value: string
}

const CodeEditor = () => {
  const fileTreeContext = useContext(FileTreeContext);
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  if (!fileTreeContext) {
    throw new Error("FileTreeContext is not provided");
  }
  const { fileTreeState, setFileTreeState, activeFile, setActiveFile } = fileTreeContext;
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
    setFiles([{ name: activeFile.key, language: extractExtension(activeFile.key), value: activeFile.value }])
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

  // useEffect(() => {
  //   console.log("NewFileTree:", fileTreeState)
  // }, [fileTreeState])

  function getValueByPath(obj: Record<string, any>, path: string, value: string) {
    console.log("Hi There...")
    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
      if (current && key in current) {
        current = current[key];
      }
      console.log("Current: ", current);
    }
    current[activeFile.key] = value;
  }


  const handleEditorChange = (value: string | undefined) => {
    console.log("ActiveFile: ", activeFile)
    console.log("Value: ", value)
    let path = ""
    path = activeFile?.path || ""
    console.log("Path:", path)
    if (value === undefined) return;
    const updatedFiles = [...files];
    // console.log("UpdatedFiles:",updatedFiles, activeTab);
    console.log("UpdatedFiles: ", updatedFiles)
    // updatedFiles[activeTab].value = value;
    const newFileTree = { ...fileTreeState } as Record<string, any>;
    console.log("New Path: ", newFileTree)
    getValueByPath(newFileTree, path, value);
    console.log("NewFileTree: ", newFileTree)
    setFileTreeState(newFileTree);
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

  const openFile = (file: File, index: number) => {
    if (activeTab == index) return;
    setActiveTab(index)
    setActiveFile({
      key: file.name,
      value: file.value
    })
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
            <button onClick={() => openFile(file, index)}>{file.name}</button>
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
            options={{
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              wordBasedSuggestions: "currentDocument",
              tabCompletion: "on",
            }}
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