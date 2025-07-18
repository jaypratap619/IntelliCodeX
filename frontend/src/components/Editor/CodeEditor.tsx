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

  useEffect(() => {
    if (!activeFile.key) return;

    setFiles((prevFiles) => {
      const existingIndex = prevFiles.findIndex((file) => file.name === activeFile.key);

      if (existingIndex !== -1) {
        setActiveTab(existingIndex);
        return prevFiles;
      } else {
        const newFile = {
          name: activeFile.key,
          language: extractExtension(activeFile.key),
          value: activeFile.value,
        };
        setActiveTab(prevFiles.length);
        return [...prevFiles, newFile];
      }
    });
  }, [activeFile.key]);

  useEffect(() => {
    if (!activeFile.key || activeFile.value === undefined) return;

    const newTree = { ...fileTreeState } as Record<string, any>;
    const path = activeFile?.path || "";
    getValueByPath(newTree, path, activeFile.value);
    setFileTreeState(newTree);
  }, [activeFile]);

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;

    setFiles((prev) => {
      const updated = [...prev];
      updated[activeTab].value = value;
      return updated;
    });

    setActiveFile({ ...activeFile, value });
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
        path: activeFile?.path || "root.src",
      });
    } else if (index < activeTab) {
      newActiveTab = activeTab - 1;
      setActiveTab(newActiveTab);
    }
  };

  const openFile = (file: File, index: number) => {
    if (activeTab === index) return;

    setActiveTab(index);
    setActiveFile({
      key: file.name,
      value: file.value,
      path: activeFile?.path || "root.src",
    });
  };

  return (
    <div className="h-[665px] mb-3 flex flex-col bg-[#1e1e1e] text-white">
      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-700 overflow-x-auto bg-[#252526] pt-2">
        {files.map((file, index) => (
          <div
            key={file.name}
            className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-t-md cursor-pointer transition ${index === activeTab
              ? "bg-[#1e1e1e] border border-b-0 border-gray-600 text-blue-400"
              : "text-gray-400 bg-[#2d2d2d] hover:bg-[#333] hover:text-gray-300"
              }`}
          >
            <button onClick={() => openFile(file, index)}>{file.name}</button>
            <button
              className="text-gray-500 hover:text-red-400"
              onClick={() => handleCloseTab(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Editor */}
      {activeTab !== -1 && files.length > 0 ? (
        <div className="h-full">
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
              fontSize: 14,
              minimap: { enabled: false },
            }}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
          No files open. Please add a new file.
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
