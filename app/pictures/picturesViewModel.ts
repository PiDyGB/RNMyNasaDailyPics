import { useInfiniteQuery } from "@tanstack/react-query";
import { ApodEntry } from "../data/apod.types";
import { getApod } from "./data/apod.services";

export function picturesViewModel() {
    const {
        data,
        error,
        fetchNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['pictures'],
        queryFn: getApod,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.length === 0) {
                return undefined
            }
            return lastPageParam + 1
        },
        getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
            if (firstPageParam <= 1) {
                return undefined
            }
            return firstPageParam - 1
        },
    })
    const apods = data?.pages?.flat()
    apods?.sort((a, b) => b.date.localeCompare(a.date))
    return {
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        error,
        apods,
    }
}