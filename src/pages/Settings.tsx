import React, {useState, useEffect, useContext} from 'react';

import {apiUrl} from "../constants/global.ts";
import {PlaceContext, TokenContext} from "../Context.tsx";
import GradeSystem from "../interfaces/GradeSystem.ts";
import Place from "../interfaces/Place.ts"
import ReusableButton from "../components/ReusableButton.tsx";
import Modal from "../components/Modal.tsx";
import AbstractForm from "../components/AbstractForm.tsx";
import MangeUsers from "../components/ManageUsers.tsx";
import ManageGradingSystems from "../components/ManageGradingSystems.tsx";
import {Box, Button, Heading, Separator} from "@chakra-ui/react";
import SelectField from "../components/SelectField";
import { toaster, Toaster} from "../components/ui/toaster.tsx";


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
    const [ modalMangeUsersModalIsOpen, setMangeUsersModalIsOpen ] = useState<boolean>(false)
    const [ refetchGradingSystems, setRefetchGradingSystems ] = useState<boolean>(false)
    const { user } = useContext(TokenContext)
    const disable = !(selectedPlace && selectedPlace.length > 0)
    const { refetchPlaces } = useContext(PlaceContext)


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

    function refetchGradingSystemsHandler() {
        setRefetchGradingSystems((prev: boolean) => !prev)
    }

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
    }, [groupID, refetchGradingSystems]);

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

    function handleSubmit(event) {
        event.preventDefault()
        if(!selectedPlace || selectedPlace.length < 1) {
            toaster.create({
                title: "No place selected",
                description: "Please select a place to edit",
                type: "error"
            })
            return
        }
        const selectPlaceObject = places.filter(place => place.id === parseInt(selectedPlace[0]))[0]
        const formData = new FormData()
        formData.append("placeId", selectedPlace[0])
        
        // Get grading system value from form data
        const gradingSystemValue = event.target.gradingSystem?.value
        if (gradingSystemValue) {
            const parsedId = parseInt(gradingSystemValue)
            if (!isNaN(parsedId) && selectPlaceObject.gradingSystem.id !== parsedId) {
                formData.append("gradingSystemId", gradingSystemValue)
            }
        }

        if(event.target.description.value) {
            formData.append("description", event.target.description.value)
        }
        if(event.target.name.value) {
            formData.append("name", event.target.name.value)
        }
        let hasExtraFields = false
        for (const [key] of formData.entries()) {
            if (key !== "placeId") {
                hasExtraFields = true
                break
            }
        }
        if (!hasExtraFields) {
            toaster.create({
                title: "No changes detected",
                description: "Please modify at least one field before submitting.",
                type: "error"
            })
            return
        }
        fetch(`${apiUrl}/api/places`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${user.access_token}`
            },
            body: formData
        })
            .then(response => {
                if(!response.ok) {
                    return response.json().then(json => {throw new Error(json.errorMessage)})
                }
                return response.json()
            })
            .then(() => toaster.create({title: "Success", description: "Route updated", type: "success"}))
            .then(() => refetchPlaces())
            .then(() => {setSelectedPlace([])})
            .catch(error => { toaster.create({title: "Error occurred", description: error.message, type: "error"})})
    }

    const addPlaceFields = [
        {"label": "Place Name", "type": "string", "name": "name"},
        {"label": "Description", "type": "string", "name": "description"},
        {"label": "Grading System", "type": "select", "name": "gradingSystem", "options": gradingSystemFields, "placeholder": "Select a grading system", "value": selectedGradingSystem, "setter": setSelectedGradingSystem, "disabled": disable},
    ]


    function formFooter(): React.ReactNode {
        return(
            <Box display="flex" justifyContent="space-between" alignItems="stretch" flexDirection="column" m={4} p={4}>
                <Button
                    size="sm"
                    flexGrow={{base: 1, sm: 0}}
                    alignSelf="center"
                    variant="solid"
                    colorPalette="blue"
                    onClick={() => setModalIsOpen(true)}
                    disabled={disable}
                    marginBottom={4}

                > Add Grading System</Button>

                <Button
                    colorPalette="blue"
                    marginBottom={2}
                    type="submit"
                >Save</Button>
                <Button
                    onClick={() => setSelectedPlace([])}
                    colorPalette="blue"
                >Close</Button>
            </Box>
        )
    }

    return(
        <Box display="flex" flexWrap="wrap">
            <Box flexBasis="100%">
                <Heading>Group Settings</Heading>
                <Separator m={4} />
                <Box display="flex" flexWrap="wrap">
                    <Button
                        colorPalette="blue" m={4} size="sm"
                        onClick={() => setMangeUsersModalIsOpen(true)}
                    >Manage Members </Button>
                </Box>
            </Box>
            <Box flexBasis="100%" w="1" justifyContent="center">
                <div>Place Settings</div>
                <Separator m={4} />
                <Box display="flex" flexDirection="column" alignItems="center" >
                    <Box w="1/2">
                        <SelectField
                            fields={placeFields}
                            setValue={setSelectedPlace}
                            value={selectedPlace}
                            placeholder="Select a place to edit"
                            width={"full"}
                        />
                        {selectedPlace && selectedPlace.length > 0 && (
                            <AbstractForm fields={addPlaceFields} handleSubmit={handleSubmit} footer={formFooter()} width={"full"}/>
                        )}
                    </Box>
                </Box>
            </Box>

            { modalIsOpen && (
                <Modal isOpen={modalIsOpen} title={"Add New Grading System"}>
                    <Modal.Body>
                        <ManageGradingSystems gradingSystems={gradingSystems} groupID={groupID} refetch={refetchGradingSystemsHandler} />
                    </Modal.Body>
                    <Modal.Footer>
                        <ReusableButton onClick={() => setModalIsOpen(false)}>Close</ReusableButton>
                    </Modal.Footer>
                </Modal>
            )}
            { modalMangeUsersModalIsOpen && (
                <Modal isOpen={modalMangeUsersModalIsOpen} title={"Manage Users"}>
                    <Modal.Body>
                        <MangeUsers groupID={groupID}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <ReusableButton onClick={() => setMangeUsersModalIsOpen(false)}>Close</ReusableButton>
                    </Modal.Footer>
                </Modal>
            ) }
            <Toaster/>
        </Box>
    )
}