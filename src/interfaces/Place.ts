import {Grade} from "./Grade.ts";

interface Place {
    gradingSystem: {
        id: number,
        grades : Grade[]
    }
    id: number,
    name: string,
    groupId: number,
    description: string,
}

export default Place;