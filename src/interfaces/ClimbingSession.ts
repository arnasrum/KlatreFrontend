import {RouteAttempt, RouteAttemptDisplay} from "./RouteAttempt.ts";

export type ClimbingSession = {
    id: string,
    groupId: number,
    placeId: number,
    timestamp: number,
    routeAttempts: RouteAttempt[]
}

export type PastSession = {
    id: string,
    groupId: number,
    placeId: number,
    timestamp: number,
    routeAttempts: RouteAttemptDisplay[]
}
