import { useContext } from "react"
import { FaFile } from "react-icons/fa"
import { FileTreeContext } from "../../context/FileTreeContext"

const FileName = ({ filename = 'Filename.js', fileValue = "", depth }: { filename?: string, fileValue: string, depth: number }) => {
    const padding = `pl-${Math.min(depth * 4, 20)}`; // max padding to avoid overflow
    const fileTreeContext = useContext(FileTreeContext);
    if (!fileTreeContext) {
        throw new Error("FileTreeContext is not provided");
    }
    const { setActiveFile } = fileTreeContext;

    const onFileSelect = () => {
        setActiveFile({ key: filename, value: fileValue })
    }
    return (
        <div onClick={onFileSelect} className={`flex items-center space-x-2 py-1 ${padding} hover:bg-gray-100 rounded cursor-pointer`}>
            <div className="flex">
                <FaFile className="inline-block mr-2 text-blue-500 text-m" />
                <button className="cursor-pointer">{filename}</button>
            </div>
        </div>
    )
}

export default FileName 