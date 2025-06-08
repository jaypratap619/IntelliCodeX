import React, { useState, useEffect } from "react";
import { type AxiosRequestConfig } from "axios";
import { FaReact, FaNode } from "react-icons/fa";
import Navbar from "../components/UI/Navbar";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
interface IProject {
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

const Home: React.FC = () => {
  let navigate = useNavigate()
  const [projects, setProjects] = useState<IProject[]>(dummyProjectData)
  const [projectName, setProjectName] = useState<string>('')
  const [projectType, setProjectType] = useState<string>('')
  const config: AxiosRequestConfig = {
    url: `/projects/create`,
    method: 'POST'
  }
  const { responseData, callApi } = useAxios(config)

  const createProject = () => {
    const newConfig: AxiosRequestConfig = {
      data: {
        projectName: projectName,
        projectType: projectType
      }
    }
    callApi(newConfig)
  }
  useEffect(() => { console.log(projects) }, [projects])
  useEffect(() => {
    if (responseData) {
      setProjects((prev) => [...prev, responseData]);
      navigate(`/sandbox/${responseData.project_id}`);
    }
  }, [responseData, navigate]);


  const getIcon = (type: string) => {
    if (type.includes("node")) return <FaNode className="inline-block mr-2 text-green-600 text-3xl" />;
    return <FaReact className="inline-block mr-2 text-blue-500 text-3xl" />;
  };


  return <div className="h-screen">
    <Navbar />
    <div className="mb-6 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl text-center">Welcome to IntelliCodeX</div>
    <p className="text-gray-600 mb-6 text-center text-xl m-3">Start building your applications with ready-to-use React or Node.js environments with Live preview.<br />Just name your project, choose a template, and get started instantly!</p>
    <div className="flex justify-center mx-2 sm:mx-6 md:mx-24 lg:mx-36 xl:mx-64">
      <aside className="w-2/5 bg-gray-100 p-8 min-h-100">
        {/* <div className="text-l font-bold mb-3">Your Projects</div> */}
        <h1 className="text-2xl font-semibold mb-6">Your Projects</h1>
        <ul>
          {projects.map((p) => (
            <li key={p.project_id} className="mb-2">
              <div className="p-2 bg-white rounded shadow flex items-center">
                <div>
                  {getIcon(p.project_type)}
                </div>
                <div>
                  {p.project_name}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>
      <main className="p-8 w-3/5 min-h-100">
        <h1 className="text-2xl font-semibold mb-6">Create New Project</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Project name"
            className="w-full p-2 border rounded"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <label className="block text-lg font-medium">Select a template:</label>
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`cursor-pointer border rounded p-4 flex flex-col items-center justify-center shadow hover:shadow-md transition ${projectType === "react-js" ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
                }`}
              onClick={() => setProjectType("react-js")}
            >
              <FaReact className={`text-3xl mb-2 ${projectType === "react-js" ? "text-blue-600" : "text-blue-500"}`} />
              <span className="font-semibold">React</span>
            </div>
            <div
              className={`cursor-pointer border rounded p-4 flex flex-col items-center justify-center shadow hover:shadow-md transition ${projectType === "react-ts" ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
                }`}
              onClick={() => setProjectType("react-ts")}
            >
              <FaReact className={`text-3xl mb-2 ${projectType === "react-ts" ? "text-cyan-700" : "text-cyan-600"}`} />
              <span className="font-semibold">React (TS)</span>
            </div>
            <div
              className={`cursor-pointer border rounded p-4 flex flex-col items-center justify-center shadow hover:shadow-md transition ${projectType === "node-js" ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"
                }`}
              onClick={() => setProjectType("node-js")}
            >
              <FaNode className={`text-3xl mb-2 ${projectType === "node-js" ? "text-green-700" : "text-green-600"}`} />
              <span className="font-semibold">Node JS</span>
            </div>
          </div>
          <button
            onClick={createProject}
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          >
            Create Project
          </button>
        </div>
      </main>
    </div>
  </div>
};
export default Home;
