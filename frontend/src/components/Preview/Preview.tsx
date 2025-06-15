import { useContext, useEffect, useRef, useState } from "react";
import * as esbuild from "esbuild-wasm";
import { virtualPlugin, flattenFiles } from "../../utils/utils.ts";
import { FileTreeContext } from "../../context/FileTreeContext.ts";

let isEsbuildInitialized = false;

const Preview = () => {
  const { fileTreeState } = useContext(FileTreeContext);

  const iframeHtml = `
    <html>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            eval(event.data);
          }, false);
        </script>
      </body>
    </html>
  `;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [files, setFiles] = useState<Record<string, string> | null>(null);
  const [esbuildInitialized, setEsbuildInitialized] = useState(false);

  // ✅ Initialize esbuild once globally
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
        setEsbuildInitialized(true); // even if already initialized, set local state
      }
    };

    initializeEsbuild();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (fileTreeState) {
      const flatFiles = flattenFiles(fileTreeState.root);
      if (isMounted) setFiles(flatFiles);
    }

    return () => {
      isMounted = false;
    };
  }, [fileTreeState]);

  useEffect(() => {
    let isMounted = true;

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

        if (isMounted && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
        }
      } catch (err) {
        console.error("Build error:", err);
      }
    };

    if (esbuildInitialized && files) {
      bundleCode();
    }

    return () => {
      isMounted = false;
    };
  }, [esbuildInitialized, files]);

  if (!fileTreeState) {
    return <div className="text-center text-gray-500">...Loading Preview</div>;
  }

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

export default Preview;
