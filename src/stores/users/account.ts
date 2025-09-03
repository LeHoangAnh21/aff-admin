import { atom } from "jotai";
import { AccountInfor } from "@/types/Account.dto"


export const userAccount = atom<AccountInfor>({})

export const userFilter = atom({
    page: 1,
    pageSize: 10,
    roles: [],
    phoneNumber: "",
})

