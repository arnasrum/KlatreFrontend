import { useState, useEffect, useContext } from 'react';
import Place from "../interfaces/Place.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import TabContainer from "../components/TabContainer.tsx";
import Boulders from "./Boulders.tsx";
import Boulder from "../interfaces/Boulder.ts";
import {TokenContext} from "../Context.tsx";
import AbstractForm from "../components/AbstractForm.tsx";
import InputField from "../interfaces/InputField.ts";
import BoulderData from "../interfaces/BoulderData.ts";
import {apiUrl} from "../constants/global.ts";

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

    useEffect(() => {
        if(!selectedPlace) {
            return
        }
        console.log(`${apiUrl}/boulders/place?accessToken=${user.access_token}&placeID=${selectedPlace}`)
        fetch(`${apiUrl}/boulders/place?accessToken=${user.access_token}&placeID=${selectedPlace}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                setBoulders(data)
                return data
            })
            .then(data => {console.log(data)})
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
        fetch(`http://localhost:8080/groups/place?accessToken=${user.access_token}&groupID=${groupID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
        <>
            <TabContainer
                items={places}
                onItemSelect={handlePlaceClick}
                onAddClick={() => setShowPlaceModal(true)}
                selectedId={selectedPlace}
                title="Places"
            />
            {selectedPlace &&
                <Boulders placeID={selectedPlace} boulderData={boulders} refetchBoulders={refetchBouldersHandler}/>
            }
        </>
    );
}

export default Places;