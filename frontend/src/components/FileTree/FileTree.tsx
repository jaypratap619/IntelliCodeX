import type { IProjectResponse } from "../../pages/Sandbox";
import FileName from "./FileName";
import FolderName from "./FolderName";

const FileTree = (props: IProjectResponse) => {
  const isFile = (item: any) => typeof item === "string";

  const recursiveTree = (item: any, depth: number = 0) => {
    return Object.keys(item).map((key) => {
      const value = item[key];
      const padding = `pl-${Math.min(depth * 4, 20)}`; // max padding to avoid overflow

      return isFile(value) ? (
        <div key={key} className={`flex items-center space-x-2 py-1 ${padding} hover:bg-gray-100 rounded cursor-pointer`}>
          <FileName filename={key} />
        </div>
      ) : (
        <div key={key} className={`py-1`}>
          <div className={`flex items-center space-x-2 ${padding} hover:bg-gray-200 rounded cursor-pointer`}>
            <FolderName folderName={key} />
          </div>
          <div className="ml-2 border-l border-gray-300 pl-2">
            {recursiveTree(value, depth + 1)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="h-[700px] w-1/4 border border-gray-300 rounded-lg p-4 shadow-md bg-white overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Project Files</h2>
      {props?.responseData?.root && recursiveTree(props.responseData.root)}
    </div>
  );
};

export default FileTree;
