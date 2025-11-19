import React, {useState, useEffect, createContext} from 'react'
import {GroupInvite} from "../interfaces/GroupInvite.ts";
import {useInvites} from "../hooks/useInvites.ts";

type UseInviteReturn = {
    invites: GroupInvite[]
    refetchInvites: () => void
    isLoading: boolean
    error: Error
    acceptInvite: (inviteId: number) => void
    rejectInvite: (inviteId: number) => void
}


export const InviteContext  = createContext<UseInviteReturn>(null)
export function InviteProvider({children}: { children: React.ReactNode}) {

    const {invites, refetchInvites, isLoading, error, acceptInvite, rejectInvite} = useInvites();


    return(
        <InviteContext.Provider value={{
            invites,
            refetchInvites,
            isLoading,
            error,
            acceptInvite,
            rejectInvite
        }}>
            {children}
        </InviteContext.Provider>
    )
}
