import ServiceAPI from "../api";

const Platform = class {
    static async list(page?: number) {
        const response: any = await ServiceAPI.get(`/api/platforms/all${!page ? "" : "/" + page}?perpage=10`)

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }

    static async search(search, page) {
        const response: any = await ServiceAPI.get(`/api/platforms/search?title=${search}&page=${page}&perpage=10`)

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }

    static async create(body, accessToken) {
        const response: any = await ServiceAPI.post("/api/platforms/create", body, {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }

    static async delete(id, accessToken) {
        const response: any = await ServiceAPI.delete(`/api/platforms/delete/${id}`, {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }

    static async getDetail(id) {
        const response: any = await ServiceAPI.get(`/api/platforms/get/${id}`)

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }

    static async update(id, body, accessToken) {
        const response: any = await ServiceAPI.put(`/api/platforms/update/${id}`, body, {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }
}

export default Platform;