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
}