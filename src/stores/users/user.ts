import { atom } from "jotai";

export const userList = atom<any>({ data: [], total: 0 });

export const userSearch = atom<{ value: string, page: number }>({ value: "", page: 1 });