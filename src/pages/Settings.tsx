import React, {useState, useEffect, useContext} from 'react';
import {Box, Select, Button, Heading, Separator} from "@chakra-ui/react";
import SelectField from "../components/SelectField";
import {apiUrl} from "../constants/global.ts";
import {TokenContext} from "../Context.tsx";
import GradeSystem from "../interfaces/GradeSystem.ts";
import Place from "../interfaces/Place.ts"
import ReusableButton from "../components/ReusableButton.tsx";
import Modal from "../components/Modal.tsx";
import AbstractForm from "../components/AbstractForm.tsx";
import GradeCreation from "../components/GradeCreation.tsx";
import { toaster, Toaster} from "../components/ui/toaster.tsx";
import MangeUsers from "../components/ManageUsers.tsx";

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
    const { user, isLoading: userLoading } = useContext(TokenContext)
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

    function handleSubmit() {
        if(!selectedPlace || selectedPlace.length < 1) {
            toaster.create({
                title: "No place selected",
                description: "Please select a place to edit",
                type: "error"
            })
            return
        }
        let toSend = false
        const selectPlaceObject = places.filter(place => place.id === parseInt(selectedPlace[0]))[0]
        const formData = new FormData()
        formData.append("groupId", groupID.toString())
        formData.append("placeId", selectedPlace[0])
        if(selectPlaceObject.gradingSystem != parseInt(selectedGradingSystem[0])) {
            formData.append("gradingSystemId", selectedGradingSystem[0])
            toSend = true
        }
        if(toSend) {
            fetch(`${apiUrl}/api/groups/place`, {
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
                .catch(error => { toaster.create({title: "Error occurred", description: error.message, type: "error"})})
        }
    }

    const addPlaceFields = [
        {"label": "Place Name", "type": "string", "name": "name"},
        {"label": "Description", "type": "string", "name": "description"},
        {"label": "Grading System", "type": "select", "name": "gradingSystem", "options": gradingSystemFields,
            "placeholder": "Select a grading system", "value": selectedGradingSystem, "setter": setSelectedGradingSystem,
            "disabled": disable
        },
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
                    onClick={() => setSelectedPlace([])}
                    colorPalette="blue"
                    marginBottom={2}
                >Save</Button>
                <Button
                    onClick={() => setSelectedPlace([])}
                    colorPalette="blue"
                >Close</Button>

            </Box>
        )
    }


    return(
        <>
            <Heading>Group Settings</Heading>
            <Separator m={4} />
            <Box display="flex" flexWrap="wrap">
                <Button
                    colorPalette="blue"
                    m={4}
                    size="sm"
                    onClick={() => setMangeUsersModalIsOpen(true)}
                >Manage Members </Button>
            </Box>
            <div>Place Settings</div>
            <Separator m={4} />
            <Box display="flex" flexWrap="wrap">
                <label>
                    Select a place to edit
                    <SelectField
                        fields={placeFields}
                        setValue={setSelectedPlace}
                        value={selectedPlace}
                        placeholder="Select a place to edit"
                    />
                </label>
                <Box flexBasis="100%">
                    {selectedPlace && selectedPlace.length > 0 && (
                        <Box justifyContent="flex-start" display="flex" flexWrap="wrap">
                            <AbstractForm fields={addPlaceFields} handleSubmit={handleSubmit} footer={formFooter()} />
                        </Box>
                    )}
                </Box>
            </Box>

            <Button onClick={handleSubmit} size="md" m={4} colorPalette="blue">Save</Button>
            { modalIsOpen && (
                <Modal isOpen={modalIsOpen} title={"Add New Grading System"}>
                    <Modal.Body>
                        <GradeCreation
                            gradeSystems={gradingSystems.filter( item => item.isGlobal == true)}
                            groupID={groupID}
                            modalSetter={setModalIsOpen}
                            refetch={setRefetchGradingSystems}
                        />
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
        </>
    )
}