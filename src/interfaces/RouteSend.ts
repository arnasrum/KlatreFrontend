type RouteSend = {
    id: number,
    userID: number,
    boulderID: number,
    attempts: number
    completed: boolean
    perceivedGrade?: string
}

export default RouteSend;