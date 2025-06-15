import { createContext, type SetStateAction } from "react";
import type { IFile, IResponseData } from "../pages/Sandbox";
import type { IProject } from "../App";

export interface FileTreeContextType {
  fileTreeState: IResponseData; // Replace `any` with the actual type of `fileTreeState`

  setFileTreeState: React.Dispatch<React.SetStateAction<IResponseData>>; // Replace `any` with the actual type of `fileTreeState`

  activeFile: IFile;

  setActiveFile: React.Dispatch<React.SetStateAction<IFile>>;

  projects: IProject[];

  setProjects: React.Dispatch<React.SetStateAction<IProject[]>>;
}

export const FileTreeContext = createContext<FileTreeContextType>({
  fileTreeState: {},
  setFileTreeState: function (_value: SetStateAction<IResponseData>): void {
    throw new Error("Function not implemented.");
  },
  activeFile: {
    key: "",
    value: "",
  },
  setActiveFile: function (_value: SetStateAction<IFile>): void {
    throw new Error("Function not implemented.");
  },
  projects: [],
  setProjects: function (_value: SetStateAction<IProject[]>): void {
    throw new Error("Function not implemented.");
  },
});
