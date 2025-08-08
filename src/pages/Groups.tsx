import { useState, useEffect, useContext } from "react"
import Places from "./Places";
import {TokenContext, GroupContext} from "../Context";
import Boulders from "./Boulders";
import Boulder from "../interfaces/Boulder";


interface Groups {
    group: Group,
    places: Array<object>
}

interface Group {
    id: number,
    name: string,
    description: string,
    places: Array<object>
}


function Groups() {

    const [groups, setGroups] = useState<Array<Groups>>([])
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
    const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null)
    const [page, setPage] = useState<number>(0)
    const [boulders, setBoulders] = useState<Array<Boulder> | null>(null)
    const [refetch, setRefetch] = useState<boolean>(false)
    const [addRefetch, setAddRefetch] = useState<boolean>(false)
    const { user } = useContext(TokenContext)

    const groupContext = {
        refetch: refetch,
        setRefetch: setRefetch,
        groupID: selectedGroupId,
        setSelectedGroupID: setSelectedGroupId,
        placeID: selectedPlaceId,
        setSelectedPlaceID: setSelectedPlaceId,
        page: page,
        setPage: setPage,
        addRefetch: addRefetch,
        setAddRefetch: setAddRefetch,
    }


    useEffect(() => {
        fetch(`http://localhost:8080/groups?accessToken=${user.access_token}`,
            {
                method: "GET",
            })
            .then(response => response.json())
            .then(responseBody => setGroups(responseBody))
    }, [refetch])


    useEffect(() => {
        if(!selectedPlaceId) {
            return
        }
        fetch("http://localhost:8080/boulders/place?accessToken=" + user.access_token + "&placeID=" + selectedPlaceId)
            .then(response => response.json())
            .then(setPage(0))
            .then(responseBody => {
                setBoulders(responseBody.data)
            })
    }, [selectedPlaceId])

    useEffect(() => {
        if(!selectedPlaceId) {
            return
        }
        fetch("http://localhost:8080/boulders/place?accessToken=" + user.access_token + "&placeID=" + selectedPlaceId)
            .then(response => response.json())
            .then(responseBody => setBoulders(responseBody.data))
    }, [refetch])

    useEffect(() => {
        if(!selectedPlaceId) {
            return
        }
        fetch("http://localhost:8080/boulders/place?accessToken=" + user.access_token + "&placeID=" + selectedPlaceId)
            .then(response => response.json())
            .then(responseBody => {
                setBoulders(responseBody.data)
                return responseBody.data
            })
            .then(boulders => setPage(boulders.length - 1))
    }, [addRefetch])


    const selectGroup = (groupId: number) => {
        setSelectedGroupId(groupId)
        setSelectedPlaceId(null)
    }

    const selectPlace = (placeId: number) => {
        setSelectedPlaceId(placeId)
    }

    const getSelectedGroup = () => {
        return groups.find(group => group.group.id === selectedGroupId)
    }

    const getSelectedGroupPlaces = () => {
        const selectedGroup = getSelectedGroup()
        return selectedGroup ? selectedGroup.places : []
    }

    const getSelectedPlace = () => {
        const places = getSelectedGroupPlaces()
        return places.find((place: any) => place.id === selectedPlaceId)
    }

    if (!groups) {
        return(
            <>
                <p>No groups</p>
            </>
        )
    } else {



        const selectedGroup = getSelectedGroup()
        const selectedPlaces = getSelectedGroupPlaces()
        const selectedPlace = getSelectedPlace()

        return(
            <GroupContext.Provider value={groupContext}>
                <h2>Groups</h2>
                
                <div style={{ display: 'flex', borderBottom: '2px solid #ccc', marginBottom: '20px' }}>
                    {groups.map((group, index) => (
                        <button
                            key={index}
                            onClick={() => selectGroup(group.group.id)}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                borderBottom: selectedGroupId === group.group.id ? '3px solid #007bff' : '3px solid transparent',
                                backgroundColor: selectedGroupId === group.group.id ? '#f8f9fa' : 'transparent',
                                color: selectedGroupId === group.group.id ? '#007bff' : '#666',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: selectedGroupId === group.group.id ? 'bold' : 'normal',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (selectedGroupId !== group.group.id) {
                                    e.currentTarget.style.backgroundColor = '#f1f3f4'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedGroupId !== group.group.id) {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                }
                            }}
                        >
                            {group.group.name}
                        </button>
                    ))}
                </div>
                
                {/* Display selected group content */}
                {selectedGroup && (
                    <div>
                        {selectedPlaces.length > 0 && (
                            <div>
                                <h5>Places:</h5>
                                <div style={{ display: 'flex', borderBottom: '2px solid #ddd', marginBottom: '15px' }}>
                                    {selectedPlaces.map((place: any, index) => (
                                        <button
                                            key={index}
                                            onClick={() => selectPlace(place.id)}
                                            style={{
                                                padding: '8px 16px',
                                                border: 'none',
                                                borderBottom: selectedPlaceId === place.id ? '3px solid #28a745' : '3px solid transparent',
                                                backgroundColor: selectedPlaceId === place.id ? '#f8f9fa' : 'transparent',
                                                color: selectedPlaceId === place.id ? '#28a745' : '#666',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: selectedPlaceId === place.id ? 'bold' : 'normal',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedPlaceId !== place.id) {
                                                    e.currentTarget.style.backgroundColor = '#f1f3f4'
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedPlaceId !== place.id) {
                                                    e.currentTarget.style.backgroundColor = 'transparent'
                                                }
                                            }}
                                        >
                                            {place.name || `Place ${index + 1}`}
                                        </button>
                                    ))}
                                </div>

                                {selectedPlace && (
                                    <div>
                                        {boulders != undefined && (
                                            <div>
                                                <strong>Boulders:</strong>
                                                <Boulders boulders={boulders} setBoulders={setBoulders} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </GroupContext.Provider>
        )
    }
}

export default Groups;