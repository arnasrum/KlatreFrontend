import { useState, useEffect, useContext } from "react";
import { TokenContext, GroupContext } from "../Context.tsx";
import { useCookies} from "react-cookie";
import AddGroupForm from "./AddGroupForm.tsx";
import TabContainer from "../components/TabContainer.tsx";
import Places from "./Places.tsx";
import type Place from "../interfaces/Place.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import DeleteButton from "../components/DeleteButton.tsx";
import { apiUrl } from "../constants/global.ts";
import { Grid, GridItem, Card, Blockquote } from "@chakra-ui/react"
import type Group from "../interfaces/Group.ts";
import {useNavigate} from "react-router";

interface Groups {
    group: Group,
    places: Array<Place>
}




function Groups() {
    const [groups, setGroups] = useState<Array<Groups>>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [refetchGroups, setRefetchGroups] = useState<boolean>(false);
    const [addRefetch, setAddRefetch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Modal states
    const [showGroupModal, setShowGroupModal] = useState<boolean>(false);

    const { user } = useContext(TokenContext)
    const navigate = useNavigate();

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
        fetch(`${apiUrl}/groups`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.access_token
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(responseBody => {
                console.log(responseBody)
                setGroups(Array.isArray(responseBody) ? responseBody : []);
            })
            .finally(() => setIsLoading(false))
            .catch(error => {
                setGroups([]);
                setIsLoading(false);
                setError(error.message || "An unexpected error occurred while loading groups")
                console.error(error);
            });
    }, [refetchGroups, user?.access_token]);

    
    function handleDeleteClick() {
        fetch(`${apiUrl}/groups`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.access_token
            },
            method: "DELETE",
            body: JSON.stringify({
                groupID: selectedGroupId,
            })
        })
            .then(response => setRefetchGroups(!refetchGroups))
            .catch(error => {
                console.log(error)
                setError(error.message || "An unexpected error occurred while loading groups")
            })
    } 
    
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
    
    const groupItems = groups.map(group => ({
        id: group.group.id,
        name: group.group.name,
        description: group.group.description,
        uuid: group.group.uuid,
    }));

    function refetchGroupsHandler() {
        setRefetchGroups((prev: boolean) => !prev)
    }

    function navigateToGroup(uuid: string, id: number) {
        navigate(`/groups/${uuid}?id=${id}`, {
            state: {
                groupData: groups.find((group: Groups) => group.group.uuid === uuid)
            }
        })
    }

    return (
        <GroupContext.Provider value={groupContext}>
            <Grid templateColumns="repeat(3, 1fr)" gap={4} p={4}>
                {groupItems.map((item: Group) => (
                    <GridItem key={crypto.randomUUID()} >
                       <Card.Root width="320px">
                           <Card.Body gap={2}>
                               <h2>
                                   <strong>{item.name}</strong>
                               </h2>
                               <Blockquote.Root>
                                   <Blockquote.Content>
                                       This is an placeholder description for the group
                                   </Blockquote.Content>
                               </Blockquote.Root>
                           </Card.Body>
                           <Card.Footer justifyContent="flex-end">
                               <ReusableButton
                                   type="button"
                                   className="solid button-auto-width"
                                   onClick={() => navigateToGroup(item.uuid, item.id)}
                               >View</ReusableButton>
                           </Card.Footer>
                       </Card.Root>
                    </GridItem>
                ))}
            </Grid>

        </GroupContext.Provider>
    );
}

export default Groups;