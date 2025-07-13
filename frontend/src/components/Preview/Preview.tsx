import { useContext, useEffect, useRef, useState } from "react";
import * as esbuild from "esbuild-wasm";
import { virtualPlugin, flattenFiles } from "../../utils/utils.ts";
import { FileTreeContext } from "../../context/FileTreeContext.ts";

let isEsbuildInitialized = false;

const Preview = () => {
  const { fileTreeState } = useContext(FileTreeContext);

  const iframeHtml = `
    <html>
      <body style="margin:0; padding:0; background:white; color:black;">
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.getElementById('root');
              root.innerHTML = '<pre style="color:red; padding:1rem;">' + err + '</pre>';
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [files, setFiles] = useState<Record<string, string> | null>(null);
  const [esbuildInitialized, setEsbuildInitialized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const initializeEsbuild = async () => {
      if (!isEsbuildInitialized) {
        await esbuild.initialize({
          wasmURL: "https://unpkg.com/esbuild-wasm@0.17.19/esbuild.wasm",
          worker: true,
        });

        if (!cancelled) {
          isEsbuildInitialized = true;
          setEsbuildInitialized(true);
        }
      } else {
        setEsbuildInitialized(true);
      }
    };

    initializeEsbuild();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (fileTreeState) {
      const flatFiles = flattenFiles(fileTreeState.root);
      setFiles(flatFiles);
    }
  }, [fileTreeState]);

  useEffect(() => {
    const bundleCode = async () => {
      if (!files || !iframeRef.current) return;

      try {
        const result = await esbuild.build({
          entryPoints: ["main.jsx"],
          bundle: true,
          write: false,
          format: "esm",
          plugins: [virtualPlugin(files)],
        });

        iframeRef.current.contentWindow?.postMessage(result.outputFiles[0].text, "*");
      } catch (err) {
        console.error("Build error:", err);
      }
    };

    if (esbuildInitialized && files) {
      bundleCode();
    }
  }, [esbuildInitialized, files]);

  if (!fileTreeState) {
    return <div className="text-center text-gray-400">...Loading Preview</div>;
  }

  return (
    <div className="h-[665px] border border-gray-700 rounded-lg shadow-lg bg-[#252526] text-gray-200">
      <h2 className="text-lg font-semibold ml-2 py-2 text-blue-400 ">Preview</h2>
      <div className="flex flex-col h-full">
        <iframe
          title="preview"
          ref={iframeRef}
          sandbox="allow-scripts"
          srcDoc={iframeHtml}
          className="w-full h-full border border-gray-700 bg-white"
        />
      </div>
    </div>
  );
};

export default Preview;
