import React, {useState, useEffect, useContext, useMemo, useRef } from "react"
import { useParams, useLocation, Outlet } from "react-router-dom"
import Boulders from "./Boulders.tsx";
import { Grid, GridItem, Tabs, Spinner } from "@chakra-ui/react"
import "./Group.css"
import Places from "./Places.tsx";
//import type Group from "../interfaces/Group.ts"
import {apiUrl} from "../constants/global.ts"
import {TokenContext} from "../Context.tsx"
import { GroupContext } from "../contexts/GroupContext.tsx"

function Group() {

    const { currentGroup, setCurrentGroup, isLoading, setIsLoading } = useContext(GroupContext)
    const { groupUUID } = useParams()
    const groupData = currentGroup
    const groupID = groupData?.id
    const location = useLocation()

    //const groupData = location.state?.groupData
    const [refetchGroups, setRefetchGroups] = useState<boolean>(false)
    const [ placeData, setPlaceData ] = useState<Array<any>>([])
    const { user, isLoading: userLoading } = useContext(TokenContext)
    const [ placeIsLoading, setPlaceIsLoading ] = useState<boolean>(true);
    const isOnAddRoute = location.pathname.endsWith("/add")

    console.log(groupData)
    useEffect(() => {
        if( (groupData && (groupData?.uuid !== groupUUID))  || !user?.access_token) {
            return
        }
        fetch(`${apiUrl}/api/places?groupID=${groupID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.access_token}`
            }
        })
            .then(response => response.json())
            .then(data => {console.log("fetched", data); return data})
            .then(data => setPlaceData(data))
            .then(_ => setPlaceIsLoading(false))
            .catch(error => console.error(error))
            .finally(() => setPlaceIsLoading(false))

    }, [refetchGroups, groupUUID, user?.access_token])

    function refetchGroupsHandler() {
        setPlaceIsLoading(true)
        setRefetchGroups((prev: boolean) => !prev)
    }

    if(isLoading || placeIsLoading || userLoading) {
        return(
            <div className="group-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spinner size="xl" color="blue.500" />
                <span style={{ marginLeft: '1rem', fontSize: '1.2rem', color: '#6b7280' }}>Loading group...</span>
            </div>
        )
    }

    if(isOnAddRoute) {
        return(
            <Outlet />
        )
    }

    return (
        <div className="group">
            <div className="group-header">
                <h1>{groupData?.name || 'Group'}</h1>
                <p className="group-description">
                    {groupData?.description || 'Explore amazing climbing spots and challenge yourself with this group.'}
                </p>
                
                <div className="group-stats-row">
                    <div className="group-stat-card">
                        <span className="group-stat-number">{placeData?.length || 0}</span>
                        <span className="group-stat-label">Climbing Places</span>
                    </div>
                    <div className="group-stat-card">
                        <span className="group-stat-number">0</span>
                        <span className="group-stat-label">Active Members</span>
                    </div>
                    <div className="group-stat-card">
                        <span className="group-stat-number">0</span>
                        <span className="group-stat-label">Total Sends</span>
                    </div>
                    <div className="group-stat-card">
                        <span className="group-stat-number">0</span>
                        <span className="group-stat-label">Boulders</span>
                    </div>
                </div>
            </div>

            <div className="group-tabs">
                <Tabs.Root defaultValue="boulders" fitted>
                    <Tabs.List>
                        <Tabs.Trigger value="boulders">🧗‍♂️ Climb</Tabs.Trigger>
                        <Tabs.Trigger value="stats">📊 Statistics</Tabs.Trigger>
                        <Tabs.Trigger value="settings">⚙️ Settings</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="boulders">
                        <Places refetchGroups={refetchGroupsHandler} groupID={groupID} places={placeData} />
                    </Tabs.Content>
                    <Tabs.Content value="stats">
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                            <h3>Statistics Coming Soon</h3>
                            <p>Track your climbing progress and group achievements here.</p>
                        </div>
                    </Tabs.Content>
                    <Tabs.Content value="settings">
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                            <h3>Group Settings</h3>
                            <p>Manage group members, permissions, and preferences.</p>
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    );

}

export default Group;