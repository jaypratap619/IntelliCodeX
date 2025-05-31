import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as esbuild from "esbuild-wasm";

type Props = {};

const Preview: React.FC = (props: Props) => {
  const iframeHtml = `
  <html>
    <body>
      <div id="root"></div>
      <script>window.addEventListener('message', (event) => { eval(event.data); }, false);</script>
    </body>
  </html>
`;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { project_id } = useParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [files, setFiles] = useState<any>(null);
  const [isEsbuildInitialized, setIsEsbuildInitialized] = useState(false);
  useEffect(() => {
    console.log(project_id);
    try {
      axios
        .get(`${API_BASE_URL}/project/get_project/${project_id}/files`)
        .then((res) => {
          console.log("res", res);
          setFiles(res.data.files);
        });
    } catch {
      console.log("API call to api/projects/getProject failed");
    }
  }, [project_id]);

  useEffect(() => {
    if (!isEsbuildInitialized) {
      console.log("files");
      const intF = async () => {
        await esbuild.initialize({
          wasmURL: "https://unpkg.com/esbuild-wasm@0.17.19/esbuild.wasm",
          worker: true,
        });
        setIsEsbuildInitialized(true)
      };
      intF()
    }
  }, []);

  useEffect(() => {
    const bundleCode = async () => {
      console.log("Hi", files)
      const result = await esbuild.build({
        entryPoints: ["main.js"],
        bundle: true,
        write: false,
        format: "esm",
        plugins: [virtualPlugin(files)],
      });
      console.log("result", result)
      iframeRef.current!.contentWindow!.postMessage(
        result.outputFiles[0].text,
        "*"
      );
    };
    if (isEsbuildInitialized) bundleCode();
  }, [isEsbuildInitialized]);

  function virtualPlugin(files: Record<string, string>): esbuild.Plugin {
    return {
      name: "virtual",
      setup(build) {
        build.onResolve({ filter: /.*/ }, (args) => {
          // 1. Direct match (entry file or top-level)
          if (files[args.path]) {
            return { path: args.path, namespace: "virtual" };
          }

          // 2. Relative import (e.g., './App.js' from 'main.js')
          if (args.importer && args.importer !== "") {
            const baseURL = new URL("https://example.com/" + args.importer);
            const resolvedPath = new URL(args.path, baseURL).pathname.slice(1);
            if (files[resolvedPath]) {
              return { path: resolvedPath, namespace: "virtual" };
            }
          }

          // 3. Absolute URL import (e.g., "https://cdn.skypack.dev/react")
          if (args.path.startsWith("https://")) {
            return { path: args.path, namespace: "url" };
          }

          // 4. Bare module import (e.g., "react")
          return {
            path: `https://cdn.skypack.dev/${args.path}`,
            namespace: "url",
          };
        });

        build.onLoad({ filter: /.*/, namespace: "virtual" }, async (args) => {
          return {
            contents: files[args.path],
            loader: "jsx",
          };
        });

        build.onLoad({ filter: /.*/, namespace: "url" }, async (args) => {
          const res = await fetch(args.path);
          if (!res.ok) {
            throw new Error(`Failed to fetch: ${args.path}`);
          }
          const text = await res.text();
          return {
            contents: text,
            loader: "jsx",
          };
        });
      },
    };
  }


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

export default Preview;
