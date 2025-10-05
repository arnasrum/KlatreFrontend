import {RouteAttempt} from "./RouteAttempt.ts";

export type ActiveSession = {
    id: string,
    groupId: number,
    placeId: number,
    startDate: string,
    routeAttempts: RouteAttempt[]
}
