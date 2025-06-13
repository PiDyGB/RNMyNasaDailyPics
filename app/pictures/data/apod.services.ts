import apiNasaGovClient from "../../network/axios";
import { ApodEntry } from "../../data/apod.types";

export async function getApod({ pageParam }: { pageParam: number }): Promise<ApodEntry[]> {
    try {
        const today = new Date()
        const endDate = new Date(today.getTime() - ((pageParam * 31) * 86400000))
        const startDate = new Date(endDate.getTime() - (30 * 86400000))
        const response = await apiNasaGovClient.get<ApodEntry[]>("/planetary/apod", {
            params: {
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0]
            }
        })
        return response.data
    } catch (error) {
        throw new Error('Apod not found')
    }
}