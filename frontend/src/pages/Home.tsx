import React, { useState, useEffect, useContext } from "react";
import { type AxiosRequestConfig } from "axios";
import { FaReact, FaNode } from "react-icons/fa";
import Navbar from "../components/UI/Navbar";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { FileTreeContext } from "../context/FileTreeContext";
import type { IProject } from "../App";



const Home: React.FC = () => {
  const navigate = useNavigate()
  const [projectName, setProjectName] = useState<string>('')
  const [projectType, setProjectType] = useState<string>('')
  const { projects, setProjects } = useContext(FileTreeContext)
  const config: AxiosRequestConfig = {
    url: `/projects/create`,
    method: 'POST'
  }
  const { responseData, callApi }: any = useAxios(config)

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

  const openProject = (project_id: string) => {
    navigate(`/sandbox/${project_id}`)
  }

  const getIcon = (type: string) => {
    if (type.includes("node")) return <FaNode className="inline-block mr-2 text-green-600 text-3xl" />;
    return <FaReact className="inline-block mr-2 text-blue-500 text-3xl" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-gray-200">
      <Navbar />

      <div className="text-center pt-10 animate-fade-in-up">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Welcome to <span className="text-blue-600">IntelliCodeX</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Start building applications in React or Node.js with live preview.<br />
          Just name your project, choose a template, and get started instantly!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center gap-8 px-6 sm:px-12 md:px-24 lg:px-36 xl:px-52 mt-10 animate-fade-in-up delay-200">
        {/* Projects */}
        <aside className="lg:w-2/5 w-full bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Projects</h2>
          <ul>
            {projects.length > 0 ? (
              projects.map((p: IProject) => (
                <li onClick={() => openProject(p.project_id)} key={p.project_id} className="mb-3 animate-fade-in-up cursor-pointer">
                  <div className="p-3 bg-gray-50 rounded-lg shadow flex items-center space-x-4 hover:bg-gray-100 transition">
                    <div className="text-xl">{getIcon(p.project_type)}</div>
                    <div className="text-gray-800 font-medium">{p.project_name}</div>
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-20 animate-fade-in-up">
                <div className="text-4xl mb-2">📂</div>
                <div className="text-lg font-semibold">No projects found</div>
                <p className="text-sm text-gray-400">You haven’t created any projects yet.</p>
              </div>
            )}
          </ul>
        </aside>

        {/* Create Section */}
        <main className="lg:w-3/5 w-full bg-white p-8 rounded-xl shadow-md animate-fade-in-up delay-300">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create a new Project</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Project name"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <label className="block text-lg font-medium text-gray-700">Select a template:</label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Template Cards */}
              {[
                { id: "react-js", label: "React", icon: <FaReact />, color: "blue" },
                { id: "react-ts", label: "React (TS)", icon: <FaReact />, color: "cyan" },
                { id: "node-js", label: "Node JS", icon: <FaNode />, color: "green" },
              ].map((t) => (
                <div
                  key={t.id}
                  className={`cursor-pointer border rounded p-6 flex flex-col items-center justify-center shadow hover:shadow-lg transition-all duration-200 ${projectType === t.id
                    ? `border-${t.color}-500 bg-${t.color}-50 scale-105`
                    : "border-gray-300 bg-white"
                    }`}
                  onClick={() => setProjectType(t.id)}
                >
                  <div className={`text-3xl mb-2 text-${t.color}-600`}>{t.icon}</div>
                  <span className="font-semibold text-gray-700">{t.label}</span>
                </div>
              ))}
            </div>

            {/* 👇 Stylish Button */}
            <button
              onClick={createProject}
              disabled={!(projectName && projectType)}
              className={`mt-5 px-4 py-2 text-white font-semibold text-lg rounded-full transition-all duration-300 flex items-center justify-center gap-2
    ${projectName && projectType
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed opacity-60"
                }`}
            >
              <span>🚀 Create Project</span>
            </button>

          </div>
        </main>
      </div>
    </div>

  );

};
export default Home;


