import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as esbuild from "esbuild-wasm";

function flattenFiles(obj: any, prefix = ""): Record<string, string> {
  let result: Record<string, string> = {};
  for (const key in obj) {
    const value = obj[key];
    const path = prefix ? `${prefix}/${key}` : key;
    if (typeof value === "string") {
      result[path] = value;
    } else if (typeof value === "object" && value !== null) {
      result = { ...result, ...flattenFiles(value, path) };
    }
  }
  return result;
}

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
  const [files, setFiles] = useState<Record<string, string> | null>(null);
  const [isEsbuildInitialized, setIsEsbuildInitialized] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/project/get_project/${project_id}/files`)
      .then((res) => {
        console.log("res", res);
        const flatFiles = flattenFiles(res.data.root);
        console.log("flatFiles", flatFiles);
        setFiles(flatFiles);
      })
      .catch(() => {
        console.log("API call to /project/get_project failed");
      });
  }, [project_id]);

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


  const virtualPlugin = (files: Record<string, string>): esbuild.Plugin => {
    return {
      name: 'virtual-filesystem',
      setup(build) {
        // Handle entry file like "main.js"
        build.onResolve({ filter: /^main\.js$/ }, () => ({
          path: 'main.js',
          namespace: 'virtual',
        }));

        // Handle relative imports (e.g., ./App.js or ../utils/helper.js)
        build.onResolve({ filter: /^\.+\// }, (args) => {
          const fullPath = new URL(args.path, 'https://example.com/' + args.resolveDir + '/').pathname.slice(1);
          return { path: fullPath, namespace: 'virtual' };
        });

        // Handle bare module imports (e.g., "react", "axios")
        build.onResolve({ filter: /^[^./].*/ }, (args) => {
          return {
            path: `https://cdn.skypack.dev/${args.path}`,
            namespace: 'url',
          };
        });

        // Handle fully-qualified URL imports
        build.onResolve({ filter: /^https?:\/\// }, (args) => ({
          path: args.path,
          namespace: 'url',
        }));

        // Load files from the virtual filesystem
        build.onLoad({ filter: /.*/, namespace: 'virtual' }, async (args) => {
          const content = files[args.path.replace(/^\/+/, '')];
          if (!content) {
            throw new Error(`File not found in virtual filesystem: ${args.path}`);
          }
          return {
            contents: content,
            loader: 'jsx',
          };
        });

        // Load modules from Skypack and rewrite internal imports
        build.onLoad({ filter: /.*/, namespace: 'url' }, async (args) => {
          const res = await fetch(args.path);
          if (!res.ok) {
            throw new Error(`Failed to fetch: ${args.path}`);
          }
          let contents = await res.text();

          // Rewrite internal Skypack paths
          contents = contents.replace(
            /from\s+['"]\/(.*?)['"]/g,
            (_match, subpath) => {
              if (subpath.startsWith('-/')) {
                return `from "${subpath}"`;
              }
              return `from "/${subpath}"`; // leave untouched if not Skypack style
            }
          );

          return {
            contents,
            loader: 'jsx',
          };
        });
      },
    };
  };


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
