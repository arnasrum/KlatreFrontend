import Boulder from './Boulder.ts';
import RouteSend from "./RouteSend.ts";

type BoulderData = {
    boulder: Boulder,
    routeSend: RouteSend | null,
};

export default BoulderData;