import React, { createContext } from 'react'
import {ActiveSession} from "./interfaces/ActiveSession.ts";


export const TokenContext: React.Context<any> = createContext(undefined)

export const BoulderContext: React.Context<any> = createContext(undefined)

export const GroupContext: React.Context<any> = createContext(undefined)

export const PlaceContext: React.Context<any> = createContext(undefined)

export const UserContext: React.Context<any> = createContext(undefined)