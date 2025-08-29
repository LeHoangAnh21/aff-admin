import ServiceAPI from "../api";


const Statistic = class {
    static async getRevenue(period, access_token) {
        const response: any = await ServiceAPI.get(`/api/statistics/revenue?period=${period}`, {
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async getStatisticSystem(access_token) {
        const response: any = await ServiceAPI.get(`/api/statistics/system`, {
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async getProfileView(access_token, body) {
        const response: any = await ServiceAPI.post(`/api/users/store-views`, body, {
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async getNewbieCount(access_token, body) {
        const response: any = await ServiceAPI.post(`/api/users/newbie-count`, body, {
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response;
    }
}

export default Statistic