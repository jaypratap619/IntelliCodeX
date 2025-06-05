import * as esbuild from "esbuild-wasm";
export function flattenFiles(obj: any, prefix = ""): Record<string, string> {
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

export const virtualPlugin = (
  files: Record<string, string>
): esbuild.Plugin => {
  return {
    name: "virtual-filesystem",
    setup(build) {
      // Handle entry file like "main.js"
      build.onResolve({ filter: /^main\.js$/ }, () => ({
        path: "main.js",
        namespace: "virtual",
      }));

      // Handle relative imports (e.g., ./App.js or ../utils/helper.js)
      build.onResolve({ filter: /^\.+\// }, (args) => {
        const fullPath = new URL(
          args.path,
          "https://example.com/" + args.resolveDir + "/"
        ).pathname.slice(1);
        return { path: fullPath, namespace: "virtual" };
      });

      // Handle bare module imports (e.g., "react", "axios")
      build.onResolve({ filter: /^[^./].*/ }, (args) => {
        return {
          path: `https://cdn.skypack.dev/${args.path}`,
          namespace: "url",
        };
      });

      // Handle fully-qualified URL imports
      build.onResolve({ filter: /^https?:\/\// }, (args) => ({
        path: args.path,
        namespace: "url",
      }));

      // Load files from the virtual filesystem
      build.onLoad({ filter: /.*/, namespace: "virtual" }, async (args) => {
        const content = files[args.path.replace(/^\/+/, "")];
        if (!content) {
          throw new Error(`File not found in virtual filesystem: ${args.path}`);
        }
        return {
          contents: content,
          loader: "jsx",
        };
      });

      // Load modules from Skypack and rewrite internal imports
      build.onLoad({ filter: /.*/, namespace: "url" }, async (args) => {
        const res = await fetch(args.path);
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${args.path}`);
        }
        let contents = await res.text();

        // Rewrite internal Skypack paths
        contents = contents.replace(
          /from\s+['"]\/(.*?)['"]/g,
          (_match, subpath) => {
            if (subpath.startsWith("-/")) {
              return `from "${subpath}"`;
            }
            return `from "/${subpath}"`; // leave untouched if not Skypack style
          }
        );

        return {
          contents,
          loader: "jsx",
        };
      });
    },
  };
};
