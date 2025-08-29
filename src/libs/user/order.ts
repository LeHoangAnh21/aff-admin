import ServiceAPI from "../api";


const Order = class {
    static async listOrderAdmin(payload: any, sessionToken: string | null) {
        const response: any = await ServiceAPI.post(`/api/orders/admin`, payload, {
            headers: {
                "Authorization": "Bearer " + sessionToken
            }
        })

        if ('status' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async getOrderDetail(id: string, sessionToken: string | null) {
        const response: any = await ServiceAPI.get(`/api/orders/admin/${id}`, {
            headers: {
                "Authorization": "Bearer " + sessionToken
            }
        })

        if ('status' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async linkInsurance(id: string, payload: { insuranceLink: string }, sessionToken: string | null) {
        const response: any = await ServiceAPI.patch(`/api/orders/${id}/insurance-link`, payload, {
            headers: {
                "Authorization": "Bearer " + sessionToken
            }
        })

        if ('status' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async updateOrderStatusAdmin(id: string, payload: { statusCode: string }, sessionToken: string | null) {
        const response: any = await ServiceAPI.patch(`/api/orders/${id}/status`, payload, {
            headers: {
                "Authorization": "Bearer " + sessionToken
            }
        })

        if ('status' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async exportOrder(sessionToken: string) {
        const res: any = await ServiceAPI.get(`/api/orders/export/excel`, {
            headers: {
                "Authorization": "Bearer " + sessionToken
            },
            responseType: 'blob',
        })

        return res;
    }
}

export default Order;