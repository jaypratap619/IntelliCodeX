/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { FileTreeContext } from "../../context/FileTreeContext";

interface File {
  name: string;
  language: string;
  value: string;
}

const CodeEditor = () => {
  const fileTreeContext = useContext(FileTreeContext);
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  if (!fileTreeContext) {
    throw new Error("FileTreeContext is not provided");
  }

  const {
    fileTreeState,
    setFileTreeState,
    activeFile,
    setActiveFile,
    defaultFile,
    setDefaultFile,
  } = fileTreeContext;

  function extractExtension(fileName: string): string {
    const obj = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      css: "css",
      scss: "scss",
      html: "html",
      md: "markdown",
      json: "json",
      xml: "xml",
      yaml: "yaml",
      yml: "yaml",
      sql: "sql",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      sh: "shell",
      txt: "plaintext",
    };

    const ext = fileName.split(".").pop() || "";
    return obj[ext as keyof typeof obj] || "plaintext";
  }

  function getValueByPath(obj: Record<string, any>, path: string, value: string) {
    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
      if (current && key in current) {
        current = current[key];
      }
    }

    current[activeFile.key] = value;
  }

  // Handle initial load from Sandbox defaultFile
  useEffect(() => {
    if (defaultFile) {
      const newFile = {
        name: defaultFile.key,
        language: extractExtension(defaultFile.key),
        value: defaultFile.value,
      };
      setFiles([newFile]);
      setActiveTab(0);
      setActiveFile(defaultFile);
      setDefaultFile(null);
    }
  }, [defaultFile]);

  // Handle tab switching or adding new tabs
  useEffect(() => {
    if (!activeFile.key) return;

    const existingFileIndex = files.findIndex((file) => file.name === activeFile.key);

    if (existingFileIndex !== -1) {
      setActiveTab(existingFileIndex);
    } else {
      const newFile = {
        name: activeFile.key,
        language: extractExtension(activeFile.key),
        value: activeFile.value,
      };
      setFiles((prev) => [...prev, newFile]);
      setActiveTab(files.length);
    }
  }, [activeFile.key]);

  // 🔁 Always keep fileTreeState in sync with latest activeFile.value
  useEffect(() => {
    if (!activeFile.key || activeFile.value === undefined) return;

    const newTree = { ...fileTreeState } as Record<string, any>;
    const path = activeFile?.path || "";
    getValueByPath(newTree, path, activeFile.value);
    setFileTreeState(newTree);
  }, [activeFile]);

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;

    const updatedFiles = [...files];
    updatedFiles[activeTab].value = value;
    setFiles(updatedFiles);
    setActiveFile({ ...activeFile, value }); // triggers sync effect above
  };

  const handleCloseTab = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    if (newFiles.length === 0) {
      setActiveTab(-1);
      return;
    }

    let newActiveTab = activeTab;

    if (index === activeTab) {
      newActiveTab = index > 0 ? index - 1 : 0;
      setActiveTab(newActiveTab);
      setActiveFile({
        key: newFiles[newActiveTab].name,
        value: newFiles[newActiveTab].value,
      });
    } else if (index < activeTab) {
      newActiveTab = activeTab - 1;
      setActiveTab(newActiveTab);
    }
  };

  const openFile = (file: File, index: number) => {
    if (activeTab === index) return;

    // Step 1: Update tab
    setActiveTab(index);

    // Step 2: Update active file
    const updatedFile = {
      key: file.name,
      value: file.value,
      path: activeFile?.path || "root.src", // ⚠️ Ensure path is passed correctly
    };
    setActiveFile(updatedFile);

    // Step 3: Update fileTreeState so preview triggers
    const newTree = { ...fileTreeState } as Record<string, any>;
    const path = updatedFile.path;
    getValueByPath(newTree, path, file.value);
    setFileTreeState(newTree);
  };


  useEffect(() => {
    console.log("activeFile updated", activeFile);
  }, [activeFile]);

  useEffect(() => {
    console.log("fileTreeState changed, triggering Preview");
  }, [fileTreeState]);


  return (
    <div className="h-[650px] flex flex-col">
      {/* Tabs */}
      <div className="flex space-x-4 border-gray-300 mb-2 overflow-x-auto">
        {files.map((file, index) => (
          <div
            key={file.name}
            className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-t ${index === activeTab
              ? "bg-white border border-b-0 border-gray-300 text-blue-600"
              : "text-gray-600 bg-gray-100"
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
      {activeTab !== -1 && files.length > 0 ? (
        <div className="flex-1">
          <Editor
            height="100%"
            value={files[activeTab].value}
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
  );
};

export default CodeEditor;
