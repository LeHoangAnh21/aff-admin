import { atom } from "jotai";

export const categoryData = atom<any>({ data: [], total: 0 });

export const categoryPage = atom<number>(1);

export const categorySearch = atom<string>("");

export const isFirstLoading = atom(false);