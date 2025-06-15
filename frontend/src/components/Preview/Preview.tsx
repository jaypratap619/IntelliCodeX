import { useContext, useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
import * as esbuild from "esbuild-wasm";
import { virtualPlugin, flattenFiles } from "../../utils/utils.ts";
import { FileTreeContext } from "../../context/FileTreeContext.ts";
// import type { AxiosRequestConfig } from "axios";
// import useAxios from "../../hooks/useAxios.tsx";


// type Props = {

// };

const Preview = () => {
  // const { project_id } = useParams();
  // const { data, loading, error } = useFetch(`/project/get_project/${project_id}/files`)
  const {fileTreeState} = useContext(FileTreeContext)

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

  // useEffect(() => {
  //   props.callApi()
  // }, [])


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
    if (fileTreeState) {
      const flatFiles = flattenFiles(fileTreeState.root);
      console.log("flatFiles", flatFiles);
      setFiles(flatFiles);
    }
  }, [fileTreeState]);

  // if (props.error) {
  //   return <>{props.error}</>
  // }
  // if (props.loading) {
  //   return <>....Loading</>
  // }

  if (fileTreeState) {
    return (
      <div className="h-[650px] border border-gray-300 rounded-lg p-4 shadow-md bg-white">
        <h2 className="text-lg font-semibold mb-4">Preview</h2>
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
