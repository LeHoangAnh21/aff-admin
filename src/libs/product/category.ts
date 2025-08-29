import ServiceAPI from "../api";

const Category = class {
    static async allList() {

        const response: any = await ServiceAPI.get(`/api/categories/all`)

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }

    static async list(page?: number) {

        const response: any = await ServiceAPI.get(`/api/categories/all${!page ? "" : "/" + page}?perpage=10`)

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }

    static async search(search, page) {
        const response: any = await ServiceAPI.get(`/api/categories/search?category=${search}&page=${page}&perpage=10`)

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }

    static async create(body, accessToken) {
        const response: any = await ServiceAPI.post("/api/categories/create", body, {
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
        const response: any = await ServiceAPI.delete(`/api/categories/delete/${id}`, {
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
        const response: any = await ServiceAPI.get(`/api/categories/get/${id}`)

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }

    static async update(id, body, accessToken) {
        const response: any = await ServiceAPI.put(`/api/categories/update/${id}`, body, {
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

export default Category;