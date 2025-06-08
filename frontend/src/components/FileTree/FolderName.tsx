import { FaFolder } from "react-icons/fa"

const FolderName = ({ folderName = 'Folder' }: { folderName?: string }) => {
    return (
        <div className="flex">
            <FaFolder className="inline-block mr-2 text-blue-500 text-m" />
            <div>{folderName}</div>
        </div>
    )
}

export default FolderName 