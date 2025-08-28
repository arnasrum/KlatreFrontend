import type Boulder from './Boulder.ts';
import type RouteSend from "./RouteSend.ts";

export type BoulderData = {
    boulder: Boulder,
    routeSend: RouteSend | null,
};
