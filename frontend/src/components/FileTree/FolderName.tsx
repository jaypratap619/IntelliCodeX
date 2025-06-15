import { FaFolder } from "react-icons/fa"

const FolderName = ({ folderName = 'Folder', depth }: { folderName?: string, depth: number }) => {
    const padding = `pl-${Math.min(depth * 4, 20)}`; // max padding to avoid overflow
    return (
        <div className={`flex items-center space-x-2 ${padding} hover:bg-gray-200 rounded cursor-pointer`}>
            <div className="flex">
                <FaFolder className="inline-block mr-2 text-blue-500 text-m" />
                <div>{folderName}</div>
            </div>
        </div>
    )
}

export default FolderName 