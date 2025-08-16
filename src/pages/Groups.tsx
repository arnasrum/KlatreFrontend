import { useState, useEffect, useContext } from "react";
import { TokenContext, GroupContext } from "../Context.tsx";
import "./Groups.css";
import AddGroupForm from "./AddGroupForm.tsx";
import TabContainer from "../components/TabContainer.tsx";
import Places from "./Places.tsx";
import Place from "../interfaces/Place.ts"
import ReusableButton from "../components/ReusableButton.tsx";

interface Groups {
    group: Group,
    places: Array<Place>
}

interface Group {
    id: number,
    name: string,
    description: string,
}


function Groups() {
    const [groups, setGroups] = useState<Array<Groups>>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [refetchGroups, setRefetchGroups] = useState<boolean>(false);
    const [addRefetch, setAddRefetch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // Modal states
    const [showGroupModal, setShowGroupModal] = useState<boolean>(false);

    const { user } = useContext(TokenContext);
    
    // Use custom hook for boulder management
    const groupContext = {
        refetch: refetchGroups,
        setRefetch: setRefetchGroups,
        groupID: selectedGroupId,
        setSelectedGroupID: setSelectedGroupId,
        addRefetch,
        setAddRefetch,
        setShowGroupModal,
    };

    // Fetch groups
    useEffect(() => {
        if (!user?.access_token) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        fetch(`http://localhost:8080/groups?accessToken=${user.access_token}`, {
            method: "GET",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(responseBody => {
                setGroups(Array.isArray(responseBody) ? responseBody : []);
            })
            .finally(() => setIsLoading(false))
            .catch(error => {
                setGroups([]);
                setIsLoading(false);
                console.error(error);
            });
    }, [refetchGroups, user?.access_token]);

    // Helper functions
    const selectGroup = (groupId: number) => {
        setSelectedGroupId(groupId);
    };

    const getSelectedGroup = (): Groups | null => {
        if (selectedGroupId == null) return null;
        return groups.find((group: Groups) => group.group.id === selectedGroupId) || null;
    };

    const getSelectedGroupPlaces = (): Array<Place> => {
        const selectedGroup = getSelectedGroup();
        return selectedGroup?.places || [];
    };

    if (isLoading) {
        return <div>Loading groups...</div>;
    }

    if (!user?.access_token) {
        return <div>Please log in to view groups.</div>;
    }

    if (!groups || !Array.isArray(groups)) {
        return <div>Error loading groups. Please try again.</div>;
    }

    if (groups.length === 0) {
        return (
            <div>
                <h2>Groups</h2>
                <p>No groups available</p>
                <button type="button" onClick={() => setShowGroupModal(true)}>
                    Add First Group
                </button>
            </div>
        );
    }

    if (showGroupModal) {
        return (
            <GroupContext.Provider value={groupContext}>
                <AddGroupForm/>
                <ReusableButton type="button" onClick={() => setShowGroupModal(false)}>
                    Close
                </ReusableButton>
            </GroupContext.Provider>
        );
    }

    // Prepare data for TabContainer
    const groupItems = groups.map(group => ({
        id: group.group.id,
        name: group.group.name
    }));

    function refetchGroupsHandler() {
        setRefetchGroups((prev: boolean) => !prev)
    }

    return (
        <GroupContext.Provider value={groupContext}>
            <h2>Groups</h2>
            
            <TabContainer
                title="Groups"
                items={groupItems}
                selectedId={selectedGroupId}
                onItemSelect={selectGroup}
                onAddClick={() => {
                    setShowGroupModal(true);
                }}
                activeColor="#007bff"
            />
            <Places places={getSelectedGroupPlaces()} groupID={selectedGroupId} refetchGroups={refetchGroupsHandler}/>
        </GroupContext.Provider>
    );
}

export default Groups;