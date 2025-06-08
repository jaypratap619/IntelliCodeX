import type React from "react"
import CodeEditor from "../components/Editor/CodeEditor"
import FileTree from "../components/FileTree/FileTree"
import Preview from "../components/Preview/Preview"

const Sandbox: React.FC = () => {
  return (
    <div className="h-screen">
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