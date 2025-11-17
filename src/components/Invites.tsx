import {Box, Heading} from "@chakra-ui/react";
import {useInvites} from "../hooks/useInvites.ts";
import {GroupInvite} from "../interfaces/GroupInvite.ts";


function Invites() {

    const {invites, refetchInvites}  = useInvites();
    console.log(invites)

    return(
        <Box px={12} py={6}
             data-state="open"
             _open={{
                 animation: "fade-in 1000ms ease-out",
             }}
        >
            <Box outline="1px">
                <Heading>Invites</Heading>
                {invites && (
                    invites.map((invite: GroupInvite) => (
                        <Box>
                            {invite.id}
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    )
}

export default Invites;