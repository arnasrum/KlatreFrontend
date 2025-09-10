import React, {useState, useEffect, useContext} from 'react';
import {Box, Select, Button, Heading} from "@chakra-ui/react";
import SelectField from "../components/SelectField";
import {apiUrl} from "../constants/global.ts";
import {TokenContext} from "../Context.tsx";
import GradeSystem from "../interfaces/GradeSystem.ts";
import Place from "../interfaces/Place.ts"
import ReusableButton from "../components/ReusableButton.tsx";
import Modal from "../components/Modal.tsx";
import AbstractForm from "../components/AbstractForm.tsx";
import GradeCreation from "../components/GradeCreation.tsx";

interface SettingsProps {
    groupID: number
    places: Array<Place>
}

export default function Settings(props: SettingsProps) {

    const { groupID, places } = props;

    const [selectedPlace, setSelectedPlace] = useState<string[]>([]);
    const [ gradingSystems, setGradingSystems ] = useState<Array<GradeSystem>>([])
    const [ selectedGradingSystem, setSelectedGradingSystem ] = useState<string[]>([])
    const [ modalIsOpen, setModalIsOpen ] = useState<boolean>(false)
    const { user, isLoading: userLoading } = useContext(TokenContext)
    const [ newGrades, setNewGrades ] = useState<Array<Grade>>([])
    const disable = !(selectedPlace && selectedPlace.length > 0)


    useEffect(() => {
        if(!selectedPlace || selectedPlace.length < 1) {
            return
        }
        const selectPlaceObject = places.filter(place => place.id === parseInt(selectedPlace[0]))[0]
        if(!selectPlaceObject) {
            return
        }
        setSelectedGradingSystem([selectPlaceObject.gradingSystem.toString() || ""])
    }, [selectedPlace])


    useEffect(() => {
        if(!groupID) {
            return
        }
        fetch(`${apiUrl}/api/groups/grading?groupID=${groupID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.access_token}`
            }
        })
            .then(response => response.json())
            .then(data => setGradingSystems(data))
    }, []);
    console.log("grad", gradingSystems)

    // Transform grading systems to the format expected by SelectField
    const gradingSystemFields = gradingSystems.map(system => ({
        label: system.name,
        value: system.id.toString()
    }));
    const placeFields = props.places.map(place => {
        return {
            label: place.name,
            value: place.id.toString()
        }
    })
    console.log("settings state", selectedPlace, selectedGradingSystem)
    return(
        <>
            <div>Settings</div>
            <SelectField fields={placeFields} setValue={setSelectedPlace} value={selectedPlace} />
            <Box display="flex" flexWrap="wrap">
                <Box flexBasis="100%">
                    {selectedPlace && selectedPlace.length > 0 && (
                        <>
                        <SelectField
                            fields={gradingSystemFields}
                            setValue={setSelectedGradingSystem}
                            value={selectedGradingSystem}
                            label="Grading System"
                            placeholder="Select a grading system"
                            disabled={disable}
                        />
                        <Button
                            justifySelf="flex-start"
                            variant="outline"
                            color="fg"
                            m={4}
                            onClick={() => setModalIsOpen(true)}
                            disabled={disable}
                        >
                            Add Grading System</Button>
                        </>
                    )}
                </Box>

            </Box>

            <ReusableButton>Save</ReusableButton>
            { modalIsOpen && (
                <Modal isOpen={modalIsOpen} title={"Add New Grading System"}>
                    <Modal.Body>
                        <GradeCreation gradeSystems={gradingSystems}/>

                    </Modal.Body>
                    <Modal.Footer>
                        <ReusableButton onClick={() => setModalIsOpen(false)}>Close</ReusableButton>
                    </Modal.Footer>
                </Modal>
            )}


        </>
    )
}