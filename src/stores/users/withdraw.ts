import { atom } from "jotai";

export const withdrawFilter = atom<any>({
    page: 1,
    limit: 10,
    status: []
});

