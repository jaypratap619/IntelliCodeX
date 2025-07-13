import { useContext, useEffect, useState } from "react";
import FileName from "./FileName";
import FolderName from "./FolderName";
import { FileTreeContext } from "../../context/FileTreeContext";
import type { IProject } from "../../App";
import { useParams } from "react-router-dom";

const FileTree = () => {
  const fileTreeContext = useContext(FileTreeContext);

  if (!fileTreeContext) {
    throw new Error("FileTreeContext is not provided");
  }

  const { fileTreeState, projects } = fileTreeContext;
  const { project_id } = useParams();
  const [currentProject, setCurrentProject] = useState(projects[projects.length - 1]);

  function getCurrentProject(id: string | undefined) {
    const current = projects.filter((p: IProject) => p.project_id === id);
    setCurrentProject(current[0]);
  }

  useEffect(() => {
    getCurrentProject(project_id);
  }, [project_id]);

  const isFile = (item: any) => typeof item === "string";

  const recursiveTree = (item: any, depth: number = 0) => {
    return Object.keys(item).map((key) => {
      const value = item[key];
      return isFile(value) ? (
        <FileName filename={key} fileValue={value} key={key} depth={depth} />
      ) : (
        <div key={key + depth} className={`py-1`}>
          <FolderName folderName={key} depth={depth} />
          <div className="ml-3 border-l border-gray-600 pl-2">
            {recursiveTree(value, depth + 1)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="h-[665px] border border-gray-700 rounded-lg p-4 shadow-md bg-[#1e1e1e] overflow-y-auto text-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-blue-400">
        {currentProject?.project_name}
      </h2>
      {fileTreeState?.root && recursiveTree(fileTreeState.root)}
    </div>
  );
};

export default FileTree;
