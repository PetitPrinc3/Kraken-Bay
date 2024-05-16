import { v4 as uuid } from 'uuid';
import path from 'path';

export class UploadData {
    private static uploadUuid: string
    private static uploadPath: string
    private static title: string | undefined
    private static descritpion: string | undefined
    private static videoFile: string | undefined
    private static videoPath: string | undefined
    private static posterFile: any | undefined
    private static thumbFile: any | undefined
    private static genres: string | undefined
    private static type: string | "Movies"

    private setVideoFile(name?: string) { UploadData.videoFile = name }
    private setPoster(posterFile?: any) { UploadData.posterFile = posterFile }
    private setThumb(thumbFile?: any) { UploadData.thumbFile = thumbFile }
    private setUploadUuid(id: string) { UploadData.uploadUuid = id }
    private setUploadGenres(genres?: string) { UploadData.genres = genres }
    private setUploadPath(path: string) { UploadData.uploadPath = path }

    public getUuid() { return UploadData.uploadUuid }
    public setUuid(id?: string) { this.setUploadUuid(id || "") }

    public getVideo() { return UploadData.videoFile }
    public setVideo(name?: string) { this.setVideoFile(name) }
    public setImage(target?: string, posterFile?: any) {
        if (!target) {
            this.setThumb()
            this.setPoster()
        } else if (target == "Thumbnail") {
            this.setThumb(posterFile)
        } else if (target == "Poster") {
            this.setPoster(posterFile)
        } else {
            throw new Error("Invalid target.")
        }
    }
    public getThumb() { return UploadData.thumbFile }
    public getPoster() { return UploadData.posterFile }
    public setGenre(genres?: string) { this.setUploadGenres(genres) }
    public getGenre() { return UploadData.genres }
    public getUploadPath() { console.log(UploadData.uploadPath); return UploadData.uploadPath }

    constructor() {
        this.setUuid(uuid())
        this.setUploadPath(path.join(process.cwd(), "/public/Assets/PendingUploads/", this.getUuid()))
    }

}

export const uploadData = new UploadData();