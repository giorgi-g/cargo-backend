import { FileType } from "src/prisma-client";

export const getFileType = (extension: string): FileType => {
    const normalizedExtension = extension.toLowerCase();
    switch (normalizedExtension) {
        case "csv":
            return FileType.CSV;
        case "doc":
            return FileType.DOC;
        case "docx":
            return FileType.DOCX;
        case "gif":
            return FileType.GIF;
        case "jpg":
        case "jpeg":
            return FileType.JPG;
        case "mp3":
            return FileType.MP3;
        case "mov":
        case "avi":
        case "wmv":
        case "flv":
        case "swf":
        case "webm":
        case "mp4":
            return FileType.MP4;
        case "pdf":
            return FileType.PDF;
        case "png":
            return FileType.PNG;
        case "ppt":
            return FileType.PPT;
        case "pptx":
            return FileType.PPTX;
        case "wav":
            return FileType.WAV;
        case "webp":
            return FileType.WEBP;
        case "xls":
            return FileType.XLS;
        case "xlsx":
            return FileType.XLSX;
        default:
            throw new Error(`Unsupported file type: ${extension}`);
    }
};
