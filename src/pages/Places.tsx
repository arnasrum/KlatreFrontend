import React, { useState, useEffect, useContext } from 'react';
import type Place from "../interfaces/Place.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import Boulders from "./Boulders.tsx";
import {TokenContext} from "../Context.tsx";
import AbstractForm from "../components/AbstractForm.tsx";
import type InputField from "../interfaces/InputField.ts";
import type {BoulderData} from "../interfaces/BoulderData.ts";
import {apiUrl} from "../constants/global.ts";
import {
    Box,
    Container,
    Listbox,
    useListCollection,
    Input,
    Text,
    useFilter,
} from "@chakra-ui/react"

interface PlacesProps {
    places?: Array<Place>
    groupID?: number | null
    refetchGroups: () => void
}

function Places({places, refetchGroups, groupID = null}: PlacesProps) {

    const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
    const [showPlaceModal, setShowPlaceModal] = useState<boolean>(false);
    const [boulders, setBoulders] = useState<Array<BoulderData>>([]);
    const [refetchBoulders, setRefetchBoulders] = useState<boolean>(false);
    const { user } = useContext(TokenContext);
    const { contains } = useFilter({ sensitivity: "base" })
    const {collection, filter} = useListCollection({
        "initialItems": places.map((place: Place) => {return {"value": place.id, "label": place.name}}),
        filter: contains
    })


    useEffect(() => {
        if(!selectedPlace) {
            return
        }
        fetch(`${apiUrl}/boulders/place?placeID=${selectedPlace}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.access_token
            }
        })
            .then(response => response.json())
            .then((data) => {console.log("test", data); return data;})
            .then(data => setBoulders(data))
            .catch(error => console.error(error))

    }, [selectedPlace, refetchBoulders]);

    useEffect(() => {
        setShowPlaceModal(false)
    }, [selectedPlace])

    useEffect(() => {
        setShowPlaceModal(false)
        setSelectedPlace(null)
    }, [groupID])


    function refetchBouldersHandler() {
        setRefetchBoulders((prev: boolean) => !prev)
    }

    if(!groupID) {
        return(
            <p>No group selected</p>
        )
    }

    if(!places)  {
        return(
            <p>No places</p>
        )
    }


    const addPlaceFields: Array<InputField> = [
        {"label": "Place Name", "type": "string", "name": "name"},
        {"label": "Description", "type": "string", "name": "description"},
    ]

    function handleAddPlaceSubmit(event: React.FormEvent<any>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        fetch(`http://localhost:8080/groups/place?groupID=${groupID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.access_token,
            },
            body: JSON.stringify({
                "name": formData.get("name") as string,
                "description": formData.get("description") as string
            })
        })
            //.then(response => response.json())
            .then(_ => refetchGroups())
            .then(_ => setShowPlaceModal(false))
            .catch(error => console.error(error))

    }

    if(showPlaceModal) {
        return(
            <>
                <p>Add a place</p>
                <AbstractForm fields={addPlaceFields} handleSubmit={handleAddPlaceSubmit} />
                <ReusableButton onClick={() => {setShowPlaceModal(false)}}>Close</ReusableButton>
            </>
        )
    }

    return (
        <Container m={4} p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="stretch" flexDirection="column" m={4} p={4}>
                <Listbox.Root
                    orientation="vertical"
                    collection={collection}
                >
                    <Listbox.Label hidden>Select a place</Listbox.Label>
                    <Listbox.Input
                        as={Input}
                        placeholder="Search places"
                        onChange={event => filter(event.target.value)}
                    ></Listbox.Input>
                    <Listbox.Content maxH="md">
                        {collection.items.map((placeItem: {value: number, label: string, description: string | null}) =>
                            <Box flex={1}>
                                <Listbox.Item item={placeItem} key={placeItem.value} onClick={() => setSelectedPlace(placeItem.value)}>
                                    <Listbox.ItemText>{placeItem.label}</Listbox.ItemText>
                                    <Text color="fg.muted" fontSize="xs" mt={1}>{placeItem.description || "Placeholder description"}</Text>
                                    <Listbox.ItemIndicator/>
                                </Listbox.Item>
                            </Box>
                        )}
                        <Listbox.Empty>No places in group</Listbox.Empty>
                    </Listbox.Content>
                </Listbox.Root>
                <ReusableButton>+Add Place</ReusableButton>
            </Box>
            {selectedPlace &&
                <Boulders placeID={selectedPlace} boulderData={boulders} refetchBoulders={refetchBouldersHandler}/>
            }
        </Container>
    );
}





export default Places;