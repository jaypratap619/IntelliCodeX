import { useContext } from "react"
import { FaFile } from "react-icons/fa"
import { FileTreeContext } from "../../context/FileTreeContext"

const FileName = ({ filename = 'Filename.js', fileValue = "" }: { filename?: string, fileValue: string }) => {
    const fileTreeContext = useContext(FileTreeContext);
    if (!fileTreeContext) {
        throw new Error("FileTreeContext is not provided");
    }
    const { setActiveFile } = fileTreeContext;

    const onFileSelect = () => {
        setActiveFile({ key: filename, value: fileValue })
    }
    return (
        <div className="flex">
            <FaFile className="inline-block mr-2 text-blue-500 text-m" />
            <button className="cursor-pointer" onClick={onFileSelect}>{filename}</button>
        </div>
    )
}

export default FileName 