import {Grade} from "./Grade.ts";

interface GradeSystem {
    id: number,
    name: string,
    climbType: string,
    isGlobal: boolean,
    grades: Array<Grade>
}

export default GradeSystem;