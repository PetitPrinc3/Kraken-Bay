import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { AxiosResponse } from 'axios';

export interface UploadPropsInterface {
    id: string;
    title?: string;
    genres?: string;
    description?: string;
    thumbnail?: any;
    poster?: any;
    video?: string;
    videoRequest?: Promise<any | AxiosResponse<any, any>>;

    newUpload: () => void
    setTitle: (title?: string) => void
    setGenre: (genre?: string) => void
    setDesc: (description?: string) => void
    setThumb: (thumb?: any) => void
    setPoster: (poster?: any) => void
    setVideo: (video?: string) => void
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
    videoRequest: undefined,

    newUpload: () => set({
        id: uuid(),
        title: undefined,
        genres: undefined,
        description: undefined,
        thumbnail: undefined,
        poster: undefined,
        video: undefined,
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
    setThumb: (thumb?: any) => set({
        thumbnail: thumb
    }),
    setPoster: (poster?: any) => set({
        poster: poster
    }),
    setVideo: (video?: string) => set({
        video: video
    }),
    setRequest: (request?: Promise<any | AxiosResponse<any, any>>) => set({
        videoRequest: request
    })
}))

export default useUploadModal