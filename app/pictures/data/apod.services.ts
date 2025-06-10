import apiNasaGovClient from "../../network/axios";
import { ApodEntry } from "./apod.types";

export async function getApod(): Promise<ApodEntry[]> {
    try {
        const response = await apiNasaGovClient.get<ApodEntry[]>("/planetary/apod", {
            params: {
                start_date: '2025-04-01'
            }
        })
        return Promise.resolve(response.data)
    } catch (error) {
        throw new Error('Apod not found')
    }
}