import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as esbuild from "esbuild-wasm";
import { virtualPlugin, flattenFiles } from "../../utils/utils.ts";
import type { AxiosRequestConfig } from "axios";
import useAxios from "../../hooks/useAxios.tsx";


type Props = {};

const Preview: React.FC = (props: Props) => {
  const { project_id } = useParams();
  // const { data, loading, error } = useFetch(`/project/get_project/${project_id}/files`)
  const config: AxiosRequestConfig = {
    url: `/projects/${project_id}`,
    method: 'GET'
  }
  const { responseData, loading, error, callApi } = useAxios(config)

  const iframeHtml = `
  <html>
  <body>
  <div id="root"></div>
  <script>window.addEventListener('message', (event) => { eval(event.data); }, false);</script>
  </body>
  </html>
  `;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [files, setFiles] = useState<Record<string, string> | null>(null);
  const [isEsbuildInitialized, setIsEsbuildInitialized] = useState(false);

  useEffect(() => {
    callApi()
  }, [])


  useEffect(() => {
    if (!isEsbuildInitialized) {
      const initializeEsbuild = async () => {
        await esbuild.initialize({
          wasmURL: "https://unpkg.com/esbuild-wasm@0.17.19/esbuild.wasm",
          worker: true,
        });
        setIsEsbuildInitialized(true);
      };
      initializeEsbuild();
    }
  }, []);

  useEffect(() => {
    const bundleCode = async () => {
      if (!files) return;
      const result = await esbuild.build({
        entryPoints: ["main.js"],
        bundle: true,
        write: false,
        format: "esm",
        plugins: [virtualPlugin(files)],
      });
      iframeRef.current!.contentWindow!.postMessage(
        result.outputFiles[0].text,
        "*"
      );
    };
    if (isEsbuildInitialized && files) bundleCode();
  }, [isEsbuildInitialized, files]);

  useEffect(() => {
    if (responseData) {
      const flatFiles = flattenFiles(responseData.root);
      console.log("flatFiles", flatFiles);
      setFiles(flatFiles);
    }
  }, [responseData]);

  if (error) {
    return <>{error}</>
  }
  if (loading) {
    return <>....Loading</>
  }

  if (responseData) {
    return (
      <div className="h-175 w-1/4 border-2 border-solid p-4">
        Preview
        <div className="flex flex-col h-screen">
          <iframe
            title="preview"
            ref={iframeRef}
            sandbox="allow-scripts"
            srcDoc={iframeHtml}
            className="w-full h-full"
          />
        </div>
      </div>
    );
  };
}

export default Preview;
