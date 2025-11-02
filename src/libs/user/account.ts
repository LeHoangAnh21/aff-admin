import { toast } from "react-toastify";
import ServiceAPI from "../api";

interface Api {
    data: any;
    message: string
}


interface Account {
    status?: number,
    message?: string,
    access_token: string,
    statusCode?: number,
    error?: string,
}


const Account = class {

    data: any

    static async login(phoneNumber, password) {

        const response: Account = await ServiceAPI.post('/api/auth/admin/login', { phoneNumber: phoneNumber, password: password });
        if (response.status === 401) {
            console.log(response.error);

            throw new Error(JSON.stringify(response.status));
        }

        return response.access_token;
    }


    static async list(access_token, body) {
        const response: any = await ServiceAPI.post(`/api/auth/user/list`, body, {
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async updatePass(access_token, body) {
        const response: any = await ServiceAPI.patch(`/api/auth/pass/${body.userId}`, {password: body.password, role: body.validRole ? body.validRole : null}, {
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async updateSharingStatus(access_token, body) {
        const response: any = await ServiceAPI.patch(`/api/auth/${body.userId}/block`, {type: body.type}, {
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response;
    }

    static async getUserInfo(access_token) {
        try {
            const response: any = await ServiceAPI.get('/api/auth/admin', {
                headers: {
                    "Authorization": "Bearer " + access_token
                }
            })
            return response;
        } catch (error) {
            toast.error("Tài khoản không có quyền truy cập", {
                autoClose: 3000,
            });
        }
    }

    static async updateUser(id, body, access_token) {

        const response: Api = await ServiceAPI.put('/api/auth/user/admin' + id, body, {
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response.data;
    }

    static async search(username, page, access_token) {
        const response: any = await ServiceAPI.get(`/api/users/search?username=${username}&page=${page}&perpage=10`, {
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })

        if ('error' in response) {
            throw new Error(response.message);
        }

        return response
    }
    static async syncFee(access_token) {
        const response: any = await ServiceAPI.post(`/api/auth/system`, {}, {
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })

        if ('status' in response) {
            throw new Error(response.message);
        }

        return response;
    }
}

export default Account;