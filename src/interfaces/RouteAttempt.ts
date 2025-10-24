export type RouteAttempt = {
    id: number,
    routeId: number,
    grade: string,
    attempts: number,
    completed: boolean
    timestamp: number,
};

export type RouteAttemptDisplay = {
    id: number,
    routeName: string,
    gradeName: string,
    attempts: number,
    completed: boolean
    timestamp: number,
};

export type RouteAttemptDTO = {
    routeId: number,
    attempts: number,
    completed: boolean
    timestamp: string,
};