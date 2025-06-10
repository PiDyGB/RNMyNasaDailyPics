import { useQuery } from "@tanstack/react-query";
import { ApodEntry } from "./data/apod.types";
import { getApod } from "./data/apod.services";

export function picturesViewModel() {
    const { isPending, error, data, refetch } = useQuery<ApodEntry[], Error>({
        queryKey: ['pictures'],
        queryFn: getApod
    })
    data?.sort((a, b) => b.date.localeCompare(a.date))
    return {
        isPending,
        error,
        data,
        refetch
    }
}