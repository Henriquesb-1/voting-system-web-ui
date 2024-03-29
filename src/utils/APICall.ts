import Axios from "axios";

export default class APICall {
    static #baseAPIUrl = "http://localhost:3001";

    public static async get(url: string) {
        try {
            const request = await Axios.get(`${this.#baseAPIUrl}${url}`);

            return {
                data: request.data,
                status: request.status,
                statusText: request.statusText
            };
        } catch (error) {
            throw error;
        }
    }

    public static async post(url: string, data: any) {
        try {
            const request = await Axios.post(`${this.#baseAPIUrl}${url}`, data);

            return {
                data: request.data,
                status: request.status,
                statusText: request.statusText
            }
        } catch (error) {
            throw error;
        }
    }

    public static async put(url: string, data: any) {
        try {
            const request = await Axios.put(`${this.#baseAPIUrl}${url}`, data);
            
            return {
                data: request.data,
                status: request.status,
                statusText: request.statusText
            }
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public static async delete(url: string) {
        try {
            const request = await Axios.delete(`${this.#baseAPIUrl}${url}`);
            
            return {
                data: request.data,
                status: request.status,
                statusText: request.statusText
            }
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}