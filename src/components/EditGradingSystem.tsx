import {Heading, Box, Button} from "@chakra-ui/react";
import GradeSystem from "../interfaces/GradeSystem.ts";
import SelectField from "./SelectField.tsx";
import React, {useContext, useState} from "react";
import {Grade} from "../interfaces/Grade.ts";
import {apiUrl} from "../constants/global.ts";
import {TokenContext} from "../Context.tsx";
import {toaster, Toaster} from "./ui/toaster.tsx";


interface EditGradingSystemProps {
    groupID: number,
    gradeSystems: GradeSystem[]
    refetch: () => void
}


function EditGradingSystem(
    {groupID, refetch, gradeSystems}: EditGradingSystemProps
) {

    const { user } = useContext(TokenContext)
    const [selectedGradeSystem, setSelectedGradeSystem] = useState<string[]>([])
    const [selectedGrade, setSelectedGrade] = useState<string[]>([])
    const gradeSystemFields = gradeSystems.map((gradeSystem: GradeSystem) => {
        return{label: gradeSystem.name.toString(), value: gradeSystem.id.toString() }
    })


    function deleteGradeSystem() {
        const gradingSystemId = selectedGradeSystem[0]
        const formData = new FormData()
        formData.set("gradingSystemId", gradingSystemId)
        formData.set("groupId", groupID.toString())

        fetch(`${apiUrl}/api/gradingSystems`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user.access_token}`
            },
            body: formData,
        })
            .then(response => {
                if(!response.ok) {
                    return response.json().then(json => {throw new Error(json.errorMessage)})
                }
                return response.json()
            })
            .then(data => {
                toaster.create({title: "Grade System successfully deleted", description: data.message, type: "success"})
                setSelectedGradeSystem([])
                setSelectedGrade([])
            })
            .then(() => refetch())
            .catch(error => {
                toaster.create({title: "Error occurred", description: error.message, type: "error"})
            })

    }

    return (
        <Box m={4}>
            <SelectField
                fields={gradeSystemFields}
                value={selectedGradeSystem}
                setValue={setSelectedGradeSystem}
                label="Reference Grade System"
                zIndex={9000}
            />
            {selectedGradeSystem.length > 0 && (
                <Button colorPalette="red" onClick={deleteGradeSystem}>Delete Grade System</Button>
            )}
            {gradeSystems && selectedGradeSystem.length > 0 && (() => {
                const gradeFields = gradeSystems.find(system => system.id == parseInt(selectedGradeSystem[0]))
                    .grades.map((grade: Grade) => {
                    return {label: grade.gradeString, value: grade.id.toString()}
                })
                return (
                    <SelectField
                        fields={gradeFields}
                        value={selectedGrade}
                        setValue={setSelectedGrade}
                        label="Reference Grade System"
                        zIndex={9000}
                    />
                )
            })()}
            <Toaster/>
        </Box>
    )
}

export default EditGradingSystem;