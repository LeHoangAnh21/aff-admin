import ServiceAPI from "../api";


const Law = class {
    static async listOrderAdmin(page: number, sessionToken: string | null) {
        const response: any = await ServiceAPI.get(`/api/orders/admin?page=${page}&perpage=10`, {
            headers: {
                "Authorization": "Bearer " + sessionToken
            }
        })

        if ('statusCode' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async create(body, sessionToken) {
        const response: any = await ServiceAPI.post(`/api/laws`, body, {
            headers: {
                "Authorization": "Bearer " + sessionToken
            }
        })

        if ('status' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async edit(id, body, sessionToken) {
        const response: any = await ServiceAPI.patch(`/api/laws/${id}`, body, {
            headers: {
                "Authorization": "Bearer " + sessionToken
            }
        })

        if ('status' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async delete(id, sessionToken) {
        const response: any = await ServiceAPI.delete(`/api/laws/${id}`, {
            headers: {
                "Authorization": "Bearer " + sessionToken
            }
        })

        if ('status' in response) {
            throw new Error(response.message);
        }

        return response;
    }
}

export default Law;