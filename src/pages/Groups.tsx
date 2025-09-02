import { useState, useEffect, useContext } from "react";
import { TokenContext } from "../Context.tsx";
import AddGroupForm from "./AddGroupForm.tsx";
import type Place from "../interfaces/Place.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import { apiUrl } from "../constants/global.ts";
import { Grid, GridItem, Card, Blockquote } from "@chakra-ui/react"
import type Group from "../interfaces/Group.ts";
import {useNavigate} from "react-router";
import { GroupContext } from "../contexts/GroupContext.tsx"
import "./Groups.css"

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
    const { setCurrentGroup } = useContext(GroupContext)
    
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
        fetch(`${apiUrl}/api/groups`, {
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
        fetch(`${apiUrl}/api/groups`, {
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
        return (
            <div className="groups-loading">
                <div>Loading groups...</div>
            </div>
        );
    }

    if (!user?.access_token) {
        return (
            <div className="groups-empty">
                <h2>Welcome!</h2>
                <p>Please log in to view your groups.</p>
            </div>
        );
    }

    if (!groups || !Array.isArray(groups)) {
        return (
            <div className="groups-empty">
                <h2>Oops!</h2>
                <p>Error loading groups. Please try again.</p>
            </div>
        );
    }

    if (groups.length === 0) {
        return (
            <div className="groups-container">
                <div className="groups-empty">
                    <h2>No Groups Yet</h2>
                    <p>Create your first climbing group to get started!</p>
                    <button 
                        type="button" 
                        className="view-group-btn"
                        onClick={() => setShowGroupModal(true)}
                    >
                        Create First Group
                    </button>
                </div>
            </div>
        );
    }

    if (showGroupModal) {
        return (
            <GroupContext.Provider value={groupContext}>
                <AddGroupForm/>
                <div className="group-actions">
                    <ReusableButton 
                        type="button" 
                        className="secondary"
                        onClick={() => setShowGroupModal(false)}
                    >
                        Close
                    </ReusableButton>
                </div>
            </GroupContext.Provider>
        );
    }
    
    const groupItems = groups.map(group => ({
        id: group.group.id,
        name: group.group.name,
        description: group.group.description,
        uuid: group.group.uuid,
        places: group.places,
    }));

    function refetchGroupsHandler() {
        setRefetchGroups((prev: boolean) => !prev)
    }

    function navigateToGroup(uuid: string, group: Group) {
        setCurrentGroup(group)
        navigate(`/groups/${uuid}?id=${group.id}`)
    }

    return (
        <div className="groups-container">
            <div className="groups-header">
                <h1>Your Climbing Groups</h1>
                <p>Discover, explore, and conquer new bouldering challenges with your community</p>
            </div>
            
            <div className="groups-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {groupItems.map((item: any) => (
                    <div key={crypto.randomUUID()} className="group-card">
                        <div className="group-card-body">
                            <h3 className="group-card-title">{item.name}</h3>
                            <p className="group-card-description">
                                {item.description || "Explore amazing climbing spots and challenge yourself with this group."}
                            </p>
                            
                            <div className="group-card-stats">
                                <div className="group-stat">
                                    <span className="group-stat-number">{item.places?.length || 0}</span>
                                    <span className="group-stat-label">Places</span>
                                </div>
                                <div className="group-stat">
                                    <span className="group-stat-number">0</span>
                                    <span className="group-stat-label">Members</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group-card-footer">
                            <div className="group-stat">
                                <span className="group-stat-label">Ready to climb?</span>
                            </div>
                            <button
                                className="view-group-btn"
                                onClick={() => navigateToGroup(item.uuid, item)}
                            >
                                Enter Group
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Action Button */}
            <button 
                className="add-group-fab"
                onClick={() => setShowGroupModal(true)}
                title="Add New Group"
            >
                +
            </button>
        </div>
    );
}

export default Groups;