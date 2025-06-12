
import { createContext } from "react";
import type { IFile, IResponseData } from "../pages/Sandbox";



export interface FileTreeContextType {

    fileTreeState: IResponseData; // Replace `any` with the actual type of `fileTreeState`

    setFileTreeState: React.Dispatch<React.SetStateAction<IResponseData>>; // Replace `any` with the actual type of `fileTreeState`

    activeFile: IFile
    
    setActiveFile: React.Dispatch<React.SetStateAction<IFile>>;
}



export const FileTreeContext = createContext<FileTreeContextType | null>(null);
