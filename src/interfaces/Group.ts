import Place from "./Place.ts";

interface Group {
    id: number,
    name: string,
    description: string,
    uuid: string,
    places?: Place[]
}

export default Group;