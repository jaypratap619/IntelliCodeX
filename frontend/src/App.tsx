import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Sandbox, { type IFile, type IResponseData } from './pages/Sandbox'
import NotFound from './pages/NotFound'
import React, { useState } from 'react'
import { FileTreeContext } from './context/FileTreeContext'

export interface IProject {
  project_id: string
  project_name: string
  project_type: string
}

const dummyProjectData: IProject[] = [
  {
    project_id: "101",
    project_name: "Some Shitty Project",
    project_type: "react-js"
  },
  {
    project_id: "102",
    project_name: "Some Dummy Project",
    project_type: "node-js"
  },
  {
    project_id: "103",
    project_name: "Faltu Project",
    project_type: "react-ts"
  },

]

const App: React.FC = () => {
  const [projects, setProjects] = useState<IProject[]>(dummyProjectData)
  const [fileTreeState, setFileTreeState] = useState<IResponseData>({});
  const [activeFile, setActiveFile] = useState<IFile>({ key: "App.js", value: "" });
  return (
    <FileTreeContext.Provider value={{ fileTreeState, setFileTreeState, activeFile, setActiveFile, projects, setProjects }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sandbox/:project_id' element={<Sandbox />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </FileTreeContext.Provider>
  )
}

export default App