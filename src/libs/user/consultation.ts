import ServiceAPI from "../api";


const Consultation = class {
    static async list(page: number, sessionToken: string | null) {
        const response: any = await ServiceAPI.get(`/api/consultation-requests?page=${page}&perpage=10`, {
            headers: {
                "Authorization": "Bearer " + sessionToken
            }
        })

        if ('status' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async updateStatus(id, body, sessionToken) {
        const response: any = await ServiceAPI.patch(`/api/consultation-requests/${id}`, body, {
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

export default Consultation;