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
  console.log("id id", project_id)

  const [currentProject, setCurrentProject] = useState(projects[projects.length - 1])


  function getCurrentProject(id: string | undefined) {
    const current = projects.filter((p: IProject) => p.project_id === id)
    setCurrentProject(current[0])
  }

  useEffect(() => { getCurrentProject(project_id) }, [project_id])

  const isFile = (item: any) => typeof item === "string";

  const recursiveTree = (item: any, depth: number = 0) => {
    return Object.keys(item).map((key) => {
      const value = item[key];
      console.log(key, value);
      return isFile(value) ? (
        <FileName filename={key} fileValue={value} key={key} depth={depth} />
      ) : (
        <div key={key + depth} className={`py-1`}>
          <FolderName folderName={key} depth={depth} />
          <div className="ml-2 border-l border-gray-300 pl-2">
            {recursiveTree(value, depth + 1)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="h-[650px] border border-gray-300 rounded-lg p-4 shadow-md bg-white overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">{currentProject.project_name}</h2>
      {fileTreeState?.root && recursiveTree(fileTreeState.root)}
    </div>
  );
};

export default FileTree;
