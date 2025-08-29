import { atom } from "jotai";

export const platformData = atom<any>({ data: [], total: 0 });

export const platformPage = atom<number>(1);

export const platformSearch = atom<string>("");

export const isFirstLoading = atom(false);