import CodeEditor from "../components/Editor/CodeEditor"
import FileTree from "../components/FileTree/FileTree"
import Preview from "../components/Preview/Preview"
import useAxios from "../hooks/useAxios"
import type { AxiosRequestConfig } from "axios"
import { useParams } from "react-router-dom"
import { useEffect } from "react"


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
    <div className="h-screen">
      <h2>Sandbox</h2>
      <div className="flex">
        <FileTree responseData={responseData} loading={loading} error={error} callApi={callApi} />
        <CodeEditor responseData={responseData} loading={loading} error={error} callApi={callApi} />
        <Preview responseData={responseData} loading={loading} error={error} callApi={callApi} />
      </div>
    </div>
  )
}

export default Sandbox