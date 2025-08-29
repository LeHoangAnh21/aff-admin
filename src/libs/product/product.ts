import ServiceAPI from "../api";

const Product = class {
    static async list(body: any, access_token: string | null) {
        const { page, pageSize } = body
        const response: any = await ServiceAPI.get(`/api/products?page=${page}&perpage=${pageSize}`, {
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }

    static async search(search, page, session_token) {
        const response: any = await ServiceAPI.get(`/api/products/search?product=${search}&page=${page}&perpage=10`, {
            headers: {
                "Authorization": "Bearer " + session_token
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }

    static async create(body, accessToken) {
        const response: any = await ServiceAPI.post("/api/products", body, {
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
        const response: any = await ServiceAPI.delete(`/api/products/${id}`, {
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
        const response: any = await ServiceAPI.get(`/api/products/get/${id}`)

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }

    static async update(id, body, accessToken) {
        const response: any = await ServiceAPI.patch(`/api/products/${id}`, body, {
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

export default Product;