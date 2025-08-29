import { atom } from "jotai";

export const productData = atom<any>({ data: [], total: 0 });

export const isFirstLoading = atom(false);

export const productFilter = atom({
    page: 1,
    pageSize: 10,
});

