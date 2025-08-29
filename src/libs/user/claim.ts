import ServiceAPI from "../api";


const Claim = class {
    static async list(page: number, sessionToken: string | null) {
        const response: any = await ServiceAPI.get(`/api/claims-guides?page=${page}&perpage=10`, {
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
        const response: any = await ServiceAPI.post(`/api/claims-guides`, body, {
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
        const response: any = await ServiceAPI.patch(`/api/claims-guides/${id}`, body, {
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
        const response: any = await ServiceAPI.delete(`/api/claims-guides/${id}`, {
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

export default Claim;