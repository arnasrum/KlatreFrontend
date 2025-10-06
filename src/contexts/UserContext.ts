import { createContext } from 'react';
import  User from "../interfaces/User.ts";

type UserContextType = {
    user: User
    setUser: (user: User) => void;
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType>(null)
