import React, { useState, useEffect, useContext } from 'react';
import type Place from "../interfaces/Place.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import Boulders from "./Boulders.tsx";
import {TokenContext} from "../Context.tsx";
import AbstractForm from "../components/AbstractForm.tsx";
import type InputField from "../interfaces/InputField.ts";
import type {BoulderData} from "../interfaces/BoulderData.ts";
import {apiUrl} from "../constants/global.ts";
import {Listbox, useListCollection, Input, Stack, Text, useFilter} from "@chakra-ui/react"
import "./Places.css"

interface PlacesProps {
    places?: Array<Place>
    groupID?: number | null
    refetchGroups: () => void
}

function Places({places = [], refetchGroups, groupID = null}: PlacesProps) {

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

    // Get selected place data
    const selectedPlaceData = places.find(p => p.id === selectedPlace);

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

    function handlePlaceClick(placeID: number) {
        setSelectedPlace(placeID)
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

    if(!groupID) {
        return(
            <div className="places-empty">
                <h3>No Group Selected</h3>
                <p>Please select a group to view places.</p>
            </div>
        )
    }

    if(showPlaceModal) {
        return(
            <div style={{ padding: '1rem 0' }}>
                <div className="places-header">
                    <h2 className="places-title">Add New Place</h2>
                </div>
                <AbstractForm fields={addPlaceFields} handleSubmit={handleAddPlaceSubmit} />
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <ReusableButton
                        className="secondary"
                        onClick={() => {setShowPlaceModal(false)}}
                    >
                        Cancel
                    </ReusableButton>
                </div>
            </div>
        )
    }

    if(!places || places.length === 0)  {
        return(
            <div className="places-empty">
                <h3>No Places Yet</h3>
                <p>Add your first climbing place to get started!</p>
                <button
                    className="add-place-btn"
                    onClick={() => setShowPlaceModal(true)}
                >
                    Add First Place
                </button>
            </div>
        )
    }

    return (
        <>
            <div className="places-header">
                <h2 className="places-title">Select a Climbing Place</h2>
                <button
                    className="add-place-btn"
                    onClick={() => setShowPlaceModal(true)}
                >
                    + Add Place
                </button>
            </div>

            {selectedPlace && selectedPlaceData && (
                <div className="selected-place-banner">
                    <div className="selected-place-info">
                        <h3>{selectedPlaceData.name}</h3>
                        <p>{selectedPlaceData.description || 'Ready to climb!'}</p>
                    </div>
                    <button
                        className="clear-selection-btn"
                        onClick={() => setSelectedPlace(null)}
                    >
                        ✕ Clear
                    </button>
                </div>
            )}

            <div className="places-search-container">
                <div className="places-search">
                    <input
                        placeholder="🔍 Search climbing places..."
                        onChange={event => filter(event.target.value)}
                    />
                </div>

                {collection.items.length > 0 && (
                    <div className="places-dropdown">
                        {collection.items.map((placeItem: {value: number, label: string}) => (
                            <div
                                key={placeItem.value}
                                className={`place-item ${selectedPlace === placeItem.value ? 'selected' : ''}`}
                                onClick={() => setSelectedPlace(placeItem.value)}
                            >
                                <span className="place-name">{placeItem.label}</span>
                                <div className="place-indicator"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedPlace && (
                <Boulders placeID={selectedPlace} boulderData={boulders} refetchBoulders={refetchBouldersHandler}/>
            )}
        </>
    );
}

export default Places;