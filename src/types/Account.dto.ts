export interface AccountInfor {
    id?: string,
    phone_number?: string,
    fullname?: string,
    balancetotalPurchase?: number,
    referrerId?: string,
    roleLabel?: string,
    created_at?: string,
    updated_at?: string
}

export interface Exception {
    message: string,
    error?: string,
    statusCode: number
}

export interface AccountExeption extends AccountInfor {
    message: string,
    error?: string,
    statusCode: number
};
