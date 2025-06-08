import { FaFile } from "react-icons/fa"

const FileName = ({ filename = 'Filename.js' }: { filename?: string }) => {
    return (
        <div className="flex">
            <FaFile className="inline-block mr-2 text-blue-500 text-m" />
            <div>{filename}</div>
        </div>
    )
}

export default FileName 