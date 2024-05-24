import { fileTypeFromBuffer } from 'file-type'
import { readFileSync } from 'fs';

const mime = async (filePath: string) => {
    const buffer = readFileSync(filePath)
    return await fileTypeFromBuffer(buffer)
}

export default mime;