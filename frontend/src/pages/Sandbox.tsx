import type React from "react"
import CodeEditor from "../components/Editor/CodeEditor"
import FileTree from "../components/Editor/FileTree"
import Preview from "../components/Editor/Preview"

const Sandbox: React.FC = () => {
  return (
    <div className="h-screen bg-gray-800">
        <h2>Sandbox</h2>
        <div className="flex">
            <FileTree />
            <CodeEditor />
            <Preview />
        </div>
    </div>
  )
}

export default Sandbox