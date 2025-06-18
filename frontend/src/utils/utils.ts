import * as esbuild from "esbuild-wasm";

// Flattens nested file tree into a flat object with file paths
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
      build.onResolve({ filter: /^main\.jsx$/ }, () => ({
        path: "main.jsx",
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

      // Load JS/TS/JSX/TSX files from virtual filesystem
      build.onLoad(
        { filter: /\.(js|ts|jsx|tsx)$/, namespace: "virtual" },
        async (args) => {
          const content = files[args.path.replace(/^\/+/, "")];
          if (!content) {
            throw new Error(
              `File not found in virtual filesystem: ${args.path}`
            );
          }
          return {
            contents: content,
            loader: "jsx",
          };
        }
      );

      // ✅ Load and transform .css files into JS code that injects <style>
      build.onLoad({ filter: /\.css$/, namespace: "virtual" }, async (args) => {
        const content = files[args.path.replace(/^\/+/, "")];
        if (!content) {
          throw new Error(
            `CSS file not found in virtual filesystem: ${args.path}`
          );
        }

        // Escape backticks and backslashes to safely inject CSS into template literal
        const escaped = content
          .replace(/\\/g, "\\\\")
          .replace(/`/g, "\\`")
          .replace(/\$/g, "\\$");

        const injectedStyleCode = `
          const style = document.createElement('style');
          style.innerText = \`${escaped}\`;
          document.head.appendChild(style);
        `;

        return {
          contents: injectedStyleCode,
          loader: "js",
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
            return `from "/${subpath}"`;
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
