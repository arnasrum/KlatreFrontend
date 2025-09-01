import React, { createContext, useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { apiUrl } from '../constants/global';
import Group from '../interfaces/Group.ts';
import { TokenContext } from '../Context.tsx';

interface GroupContextType {
    currentGroup: Group | null;
    setCurrentGroup: (group: Group | null) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

export const GroupContext = createContext<GroupContextType>({
    currentGroup: null,
    setCurrentGroup: () => {},
    isLoading: false,
    setIsLoading: () => {},
});

export function GroupProvider({ children }: { children: React.ReactNode }) {
    // Initialize state from localStorage if available
    const [currentGroup, setCurrentGroupState] = useState<Group | null>(() => {
        const saved = localStorage.getItem('currentGroup');
        return saved ? JSON.parse(saved) : null;
    });
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(TokenContext);

    const setCurrentGroup = (group: Group | null) => {
        setCurrentGroupState(group);
        if (group) {
            localStorage.setItem('currentGroup', JSON.stringify(group));
        } else {
            localStorage.removeItem('currentGroup');
        }
    };

    return (
        <GroupContext.Provider value={{
            currentGroup,
            setCurrentGroup,
            isLoading,
            setIsLoading,
        }}>
            {children}
        </GroupContext.Provider>
    );
}