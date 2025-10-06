import React, { useState, useEffect, useContext, useMemo } from 'react';
import type Place from "../interfaces/Place.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import Boulders from "./Boulders.tsx";
import AbstractForm from "../components/AbstractForm.tsx";
import type InputField from "../interfaces/InputField.ts";
import type {BoulderData} from "../interfaces/BoulderData.ts";
import {apiUrl} from "../constants/global.ts";
import {Box, Container, Spinner, VStack} from "@chakra-ui/react"
import Modal from "../components/Modal.tsx";
import MyListbox from "../components/MyListbox.tsx";
import { UserContext } from "../contexts/UserContext.ts";

interface PlacesProps {
    groupID?: number | null
    refetchGroups: () => void
    setPlaces2: (places: any) => void
}

function Places({setPlaces2, refetchGroups, groupID}: PlacesProps) {

    const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
    const [showPlaceModal, setShowPlaceModal] = useState<boolean>(false);
    const [boulders, setBoulders] = useState<Array<BoulderData>>([]);
    const [refetchBoulders, setRefetchBoulders] = useState<boolean>(false);
    const [places, setPlaces] = useState<Array<Place>>([])
    const [placesItems, setPlacesItems] = useState<Array<any>>([])
    const [refetchPlaces, setRefetchPlaces] = useState<boolean>(false)
    const { user } = useContext(UserContext)

    useEffect(() => {
        if(!groupID) {
            return
        }
        fetch(`${apiUrl}/api/places?groupID=${groupID}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                console.log("fetched places:", data)
                setPlaces(Array.isArray(data) ? data : [])
                setPlaces2(Array.isArray(data) ? data : [])
                return data
            })
            .then((data) => {
                const itemsWithDescription = data && data.length > 0
                    ? data
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((place: Place) => ({
                            value: place.id,
                            label: place.name,
                            // Add the description property
                            description: place.description // Assuming 'Place' interface has a 'description'
                        })) : []
                console.log("itemsWithDescription", itemsWithDescription)
                setPlacesItems(itemsWithDescription)
                return itemsWithDescription
            })
            .catch(error => {
                console.error('Failed to fetch places:', error)
                setPlaces([])
            })
    }, [user, groupID, refetchPlaces])


    useEffect(() => {
        if(!selectedPlace) {
            return
        }
        fetch(`${apiUrl}/boulders/place?placeID=${selectedPlace}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then((data) => {return data;})
            .then(data => setBoulders(data))
            .catch(error => console.error(error))

    }, [selectedPlace, refetchBoulders]);

    useEffect(() => {
        setShowPlaceModal(false)
        setSelectedPlace(null)
    }, [groupID])

    function refetchBouldersHandler() {
        setRefetchBoulders((prev: boolean) => !prev)
    }

    let grades = null
    if(selectedPlace) {
        grades = places.find(place => place.id == selectedPlace).gradingSystem.grades
    }

    const addPlaceFields: Array<InputField> = [
        {"label": "Place Name", "type": "string", "name": "name"},
        {"label": "Description", "type": "string", "name": "description"},
    ]

    function handleAddPlaceSubmit(event: React.FormEvent<never>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set("groupID", groupID.toString())
        fetch(`http://localhost:8080/api/groups/place`, {
            method: "POST",
            credentials: "include",
            body: formData
        })
            //.then(response => response.json())
            .then(() => setRefetchPlaces(prev => !prev))
            .then(() => refetchGroups())
            .then(() => setShowPlaceModal(false))
            .catch(error => console.error(error))

    }

    if(!placesItems || placesItems.length < 1) {
        return(
            <Container m={4} p={4}>
                <Box display="flex" justifyContent="space-between" alignItems="stretch" flexDirection="column" m={4} p={4}>
                    <ReusableButton onClick={() => setShowPlaceModal(true)}>+Add Place</ReusableButton>
                </Box>
                <Spinner />
            </Container>
        )
    }

    if(showPlaceModal) {
        return(
            <>
                <p>Add a place</p>
                <Modal isOpen={showPlaceModal} title="Add Place">
                    <Modal.Body>
                        <AbstractForm fields={addPlaceFields} handleSubmit={handleAddPlaceSubmit} footer={
                            <VStack>
                                <ReusableButton type="submit">Save</ReusableButton>
                                <ReusableButton onClick={() => {setShowPlaceModal(false)}}>Close</ReusableButton>
                            </VStack>
                        }/>
                    </Modal.Body>
                </Modal>
            </>
        )
    }

    return (
        <Container m={4} p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="stretch" flexDirection="column" m={4} p={4}>
                <MyListbox initialItems={placesItems} setSelectedPlace={setSelectedPlace}/>
                <ReusableButton onClick={() => setShowPlaceModal(true)}>+Add Place</ReusableButton>
            </Box>
            {selectedPlace && grades &&
                <Boulders placeID={selectedPlace} boulderData={boulders} refetchBoulders={refetchBouldersHandler} grades={grades}/>
            }
        </Container>
    );
}

export default Places;