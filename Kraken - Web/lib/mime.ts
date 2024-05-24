import { fileTypeFromBuffer } from 'file-type'
import { createReadStream } from 'fs';

const mime = async (filePath: string) => {
    let mime: string = "Unknown"

    const stream: any[] = await new Promise(resolve => {
        const chunks: any[] = []
        createReadStream(filePath, { start: 0, end: 3, encoding: "hex" })
            .on("data", (data) => { chunks.push(data) })
            .on("end", () => { resolve(chunks) })
    })

    switch (stream[0]) {
        // JPEG
        case "ffd8ffdb":
        case "ffd8ffe0":
        case "ffd8ffee":
        case "ffd8ffe1":
        case "0000000c":
        case "ff4fff51":
        // PNG
        case "89504e47":
            mime = "Image"
            break
        // MPEG
        case "000001ba":
        case "000001b3":
        // MP4
        case "66747970":
        // MKV
        case "1a45dfa3":
            mime = "Video"
            break
        default:
            mime = "Unknown"
            break
    }

    return { header: stream[0], mime: mime }

}

export default mime;