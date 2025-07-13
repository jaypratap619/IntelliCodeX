import { createContext } from "react";
import type { IFile, IResponseData } from "../pages/Sandbox";
import type { IProject } from "../App";

export interface FileTreeContextType {
  fileTreeState: IResponseData;
  setFileTreeState: React.Dispatch<React.SetStateAction<IResponseData>>;
  activeFile: IFile;
  setActiveFile: React.Dispatch<React.SetStateAction<IFile>>;
  projects: IProject[];
  setProjects: React.Dispatch<React.SetStateAction<IProject[]>>;
  defaultFile: IFile | null;
  setDefaultFile: React.Dispatch<React.SetStateAction<IFile | null>>;
}

export const FileTreeContext = createContext<FileTreeContextType>({
  fileTreeState: {},
  setFileTreeState: () => {
    throw new Error("Function not implemented.");
  },
  activeFile: { path: "", key: "", value: "" },
  setActiveFile: () => {
    throw new Error("Function not implemented.");
  },
  projects: [],
  setProjects: () => {
    throw new Error("Function not implemented.");
  },
  defaultFile: null,
  setDefaultFile: () => {
    throw new Error("Function not implemented.");
  },
});
