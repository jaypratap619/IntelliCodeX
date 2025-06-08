import CodeEditor from "../components/Editor/CodeEditor"
import FileTree from "../components/FileTree/FileTree"
import Preview from "../components/Preview/Preview"
import useAxios from "../hooks/useAxios"
import type { AxiosRequestConfig } from "axios"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "../components/UI/Navbar"
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

interface IResponseData {
  root?: object;
}

export interface IProjectResponse {
  responseData: IResponseData | null;
  loading: boolean;
  error: string | null;
  callApi: () => void;
}


const Sandbox = () => {
  const { project_id } = useParams();
  const config: AxiosRequestConfig = {
    url: `/projects/${project_id}`,
    method: 'GET'
  }

  useEffect(() => {
    callApi();
  }, [])


  const { responseData, loading, error, callApi }: IProjectResponse = useAxios(config)
  return (
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
  )
}

export default Sandbox