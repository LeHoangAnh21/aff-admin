import ServiceAPI from "../api";

const Withdraw = class {
    static async withdrawal(payload: any, sessionToken: string | null) {
        const response: any = await ServiceAPI.post(`/api/withdrawals/admin`, payload, {
            headers: {
                "Authorization": "Bearer " + sessionToken
            }
        })

        if ('status' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async updateWithdrawalStatusAdmin(id: string, payload: { status: string }, sessionToken: string | null) {
        const response: any = await ServiceAPI.patch(`/api/withdrawals/${id}/status`, payload, {
            headers: {
                "Authorization": "Bearer " + sessionToken
            }
        })
        // if (response.status ) {
        //     throw new Error(response.message);
        // }

        return response;
    }
}

export default Withdraw