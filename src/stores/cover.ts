import { atom } from 'jotai'

interface CoverLoading {
    show: boolean,
    message: string
}

export const coverLoading = atom<CoverLoading>(
    {
        show: false,
        message: "",
    }
)