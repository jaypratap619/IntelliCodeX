import CodeEditor from "../components/Editor/CodeEditor"
import FileTree from "../components/FileTree/FileTree"
import Preview from "../components/Preview/Preview"
import useAxios from "../hooks/useAxios"
import type { AxiosRequestConfig } from "axios"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Navbar from "../components/UI/Navbar"
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { FileTreeContext } from "../context/FileTreeContext"

export interface IResponseData {
  root?: {
    src?: Record<string, string>
  };
}

export interface IProjectResponse {
  responseData: IResponseData | null;
  loading: boolean;
  error: string | null;
  callApi: () => void;
}

export interface IFile {
  key: string;
  value: string
}


const Sandbox = () => {
  const { project_id } = useParams();
  const [fileTreeState, setFileTreeState] = useState<IResponseData>({});
  const [activeFile, setActiveFile] = useState<IFile>({ key: "App.js", value: "" });


  const config: AxiosRequestConfig = {
    url: `/projects/${project_id}`,
    method: 'GET'
  }
  const { responseData, loading, error, callApi }: IProjectResponse = useAxios(config)



  useEffect(() => {
    callApi();
  }, [])

  useEffect(() => {
    console.log("Active File: ",activeFile);
  },[activeFile.key])

  useEffect(() => {
    console.log("ResponseData:", responseData)
    if (responseData && responseData.root && responseData.root.src) {
      // root.src["App.js"]
      setActiveFile({ key: activeFile.key, value: responseData?.root?.src?.[activeFile.key] })
      setFileTreeState(responseData);
    }
  }, [responseData, activeFile.key])


  return (
    <FileTreeContext.Provider value={{ fileTreeState, setFileTreeState, activeFile, setActiveFile }}>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={20} minSize={10}>
              <div className="h-full bg-[#1e1e1e] p-2 overflow-y-auto">
                <FileTree responseData={responseData} loading={loading} error={error} callApi={callApi} />
              </div>
            </Panel>

            <PanelResizeHandle className="w-1 bg-gray-600 cursor-col-resize" />

            <Panel defaultSize={50} minSize={30}>
              <div className="h-full bg-[#282c34] p-2 overflow-y-auto">
                <CodeEditor />
              </div>
            </Panel>

            <PanelResizeHandle className="w-1 bg-gray-600 cursor-col-resize" />

            <Panel defaultSize={30} minSize={20}>
              <div className="h-full bg-white p-2">
                <Preview responseData={responseData} loading={loading} error={error} callApi={callApi} />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </FileTreeContext.Provider>
  )
}

export default Sandbox