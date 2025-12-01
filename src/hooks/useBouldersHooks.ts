import React, { useState, useEffect, useCallback, useRef } from 'react';
import type Boulder from "../interfaces/Boulder.ts";
import { apiUrl } from "../constants/global.ts";

interface UseBouldersPaginatedOptions {
    placeID: number;
    limit?: number;
    autoFetch?: boolean;
    filterActive?: "all" | "active" | "retired"
}

interface UseBouldersPaginatedReturn {
    boulders: Boulder[];
    isLoading: boolean;
    isFetchingMore: boolean;
    hasMore: boolean;
    totalCount: number;
    page: number;
    error: Error | null;
    fetchBoulders: (pageNum: number, append?: boolean) => Promise<void>;
    fetchNextPage: () => Promise<void>;
    refetchBoulders: () => Promise<void>;
    observerTarget: React.RefObject<HTMLDivElement>;
}

export function useBouldersPaginated({
    placeID,
    limit = 12,
    autoFetch = true,
    filterActive = "all"
}: UseBouldersPaginatedOptions): UseBouldersPaginatedReturn {
    const [boulders, setBoulders] = useState<Boulder[]>([]);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [error, setError] = useState<Error | null>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    const fetchBoulders = useCallback(async (pageNum: number, append: boolean = false) => {
        if (append) {
            setIsFetchingMore(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const params = new URLSearchParams({
                page: pageNum.toString(),
                limit: limit.toString(),
                placeId: placeID.toString()
            })
            if(filterActive !== "all") {
                params.append("active", filterActive === "active" ? "true" : "false");
            }

            const response = await fetch(
                `${apiUrl}/boulders/place?${params.toString()}`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch boulders: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (append) {
                setBoulders(prev => [...prev, ...data.boulders]);
            } else {
                setBoulders(data.boulders);
            }
            
            setTotalCount(data.total);
            setHasMore(data.hasMore);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error occurred');
            setError(error);
            console.error('Error fetching boulders:', error);
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [placeID, limit]);

    const fetchNextPage = useCallback(async () => {
        if (!hasMore || isFetchingMore || isLoading) return;
        
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchBoulders(nextPage, true);
    }, [hasMore, isFetchingMore, isLoading, page, fetchBoulders]);

    const refetchBoulders = useCallback(async () => {
        setPage(0);
        setHasMore(true);
        await fetchBoulders(0, false);
    }, [fetchBoulders]);

    // Initial fetch
    useEffect(() => {
        if (autoFetch) {
            fetchBoulders(0, false);
        }
    }, [autoFetch, fetchBoulders]);

    // Intersection Observer for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetchingMore && !isLoading) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current && autoFetch) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, isFetchingMore, isLoading, autoFetch, fetchNextPage]);

    return {
        boulders,
        isLoading,
        isFetchingMore,
        hasMore,
        totalCount,
        page,
        error,
        fetchBoulders,
        fetchNextPage,
        refetchBoulders,
        observerTarget
    };
}

interface UseBouldersAllOptions {
    placeID: number;
    autoFetch?: boolean;
    fetchActive: "all" | "active" | "retired";
}

interface UseBouldersAllReturn {
    boulders: Boulder[];
    isLoading: boolean;
    error: Error | null;
    refetchBoulders: () => Promise<void>;
}

export function useBouldersAll({
    placeID,
    autoFetch = true,
    fetchActive = "all"
}: UseBouldersAllOptions): UseBouldersAllReturn {
    const [boulders, setBoulders] = useState<Boulder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchBoulders = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            if(!placeID) throw new Error("placeID is required");
            const active = fetchActive === "active" ? "true" : "false";
            const response = await fetch(
                `${apiUrl}/boulders/place?placeId=${placeID}&active=${active}&page=0&limit=0`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch boulders: ${response.statusText}`);
            }

            const data = await response.json();
            setBoulders(data.boulders || data);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error occurred');
            setError(error);
            console.error('Error fetching boulders:', error);
        } finally {
            setIsLoading(false);
        }
    }, [placeID]);

    useEffect(() => {
        if (autoFetch) {
            fetchBoulders();
        }
    }, [autoFetch, fetchBoulders]);

    return {
        boulders,
        isLoading,
        error,
        refetchBoulders: fetchBoulders
    };
}