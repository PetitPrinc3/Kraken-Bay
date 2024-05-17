import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { AxiosResponse } from 'axios';

export interface UploadPropsInterface {
    id: string;
    title?: string;
    genres?: string;
    description?: string;
    thumbnail?: string;
    poster?: string;
    video?: string;
    videoRequest?: Promise<any | AxiosResponse<any, any>>;
    userId?: string;
    userName?: string;

    newUpload: () => void
    setTitle: (title?: string) => void
    setGenre: (genre?: string) => void
    setDesc: (description?: string) => void
    setThumb: (thumb?: string) => void
    setPoster: (poster?: string) => void
    setVideo: (video?: string) => void
    setUserId: (id?: string) => void
    setUserName: (name?: string) => void
    setRequest: (request?: Promise<any | AxiosResponse<any, any>>) => void
}

const useUploadModal = create<UploadPropsInterface>((set, get) => ({
    id: uuid(),
    title: undefined,
    genres: undefined,
    description: undefined,
    thumbnail: undefined,
    poster: undefined,
    video: undefined,
    userId: undefined,
    userName: undefined,
    videoRequest: undefined,

    newUpload: () => set({
        id: uuid(),
        title: undefined,
        genres: undefined,
        description: undefined,
        thumbnail: undefined,
        poster: undefined,
        video: undefined,
        userId: undefined,
        userName: undefined,
        videoRequest: undefined,
    }),
    setTitle: (title?: string) => set({
        title: title
    }),
    setGenre: (genre?: string) => set({
        genres: genre
    }),
    setDesc: (description?: string) => set({
        description: description
    }),
    setThumb: (thumb?: string) => set({
        thumbnail: thumb
    }),
    setPoster: (poster?: string) => set({
        poster: poster
    }),
    setVideo: (video?: string) => set({
        video: video
    }),
    setUserId: (id?: string) => set({
        userId: id
    }),
    setUserName: (name?: string) => set({
        userName: name
    }),
    setRequest: (request?: Promise<any | AxiosResponse<any, any>>) => set({
        videoRequest: request
    })
}))

export default useUploadModal