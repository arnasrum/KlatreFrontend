import Group from "./Group.ts";
import {User} from "./User.ts";


export type GroupInvite = {
    id: number,
    group: Group
    sender: User,
    status: string,
}
