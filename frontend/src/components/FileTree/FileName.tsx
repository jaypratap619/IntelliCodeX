import { useContext } from "react";
import { FaFile } from "react-icons/fa";
import { FileTreeContext } from "../../context/FileTreeContext";

interface IFileNameProps {
    filename?: string;
    fileValue?: string;
    depth: number;
}

const FileName = ({ filename = "Filename.js", depth }: IFileNameProps) => {
    const padding = `pl-${Math.min(depth * 4, 20)}`; // max padding to avoid overflow
    const fileTreeContext = useContext(FileTreeContext);

    if (!fileTreeContext) {
        throw new Error("FileTreeContext is not provided");
    }

    const { fileTreeState, setActiveFile } = fileTreeContext;

    const onFileSelect = () => {
        console.log("File selected:", filename);
        const newValue = findValue(filename);
        const newPath = findPath(filename);
        console.log("New Path:", newPath);
        console.log("New Value:", newValue);
        setActiveFile({ key: filename, value: newValue, path: newPath });
    };

    const findPath = (fileName: string) => {
        if (!fileTreeState?.root) return "";
        const find = (obj: any, path: string): string => {
            for (const key in obj) {
                if (typeof obj[key] === "string" && key === fileName) {
                    return path + "." + key;
                } else if (typeof obj[key] === "object") {
                    const result = find(obj[key], path + "." + key);
                    if (result) return result;
                }
            }
            return "";
        };
        return find(fileTreeState.root, "root");
    };

    const findValue = (fileName: string) => {
        if (!fileTreeState?.root) return "";
        const find = (obj: any): string => {
            for (const key in obj) {
                if (typeof obj[key] === "string" && key === fileName) {
                    return obj[key];
                } else if (typeof obj[key] === "object") {
                    const result = find(obj[key]);
                    if (result) return result;
                }
            }
            return "";
        };
        return find(fileTreeState.root);
    };

    return (
        <div
            onClick={onFileSelect}
            className={`flex items-center space-x-2 py-1 ${padding} hover:bg-gray-700 rounded cursor-pointer text-gray-300 hover:text-white`}
        >
            <div className="flex">
                <FaFile className="inline-block mr-2 text-blue-400 text-m" />
                <button className="cursor-pointer">{filename}</button>
            </div>
        </div>
    );
};

export default FileName;
