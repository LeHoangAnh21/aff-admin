import { atom } from "jotai";

export const orderFilter = atom({
    page: 1,
    pageSize: 10,
    status: [],
    orderCode: ""
});

