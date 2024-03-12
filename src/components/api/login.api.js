
import axios from "axios"
import { getTokenFromLocalStorage } from "./localstorage"

export const instance = axios.create({
    baseURL: '',
    headers: {
        Authorization: 'Bearer' + getTokenFromLocalStorage() || '',
    }
})