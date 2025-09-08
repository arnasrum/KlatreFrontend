import React, {useState, useEffect, useContext} from 'react';
import { Select } from "@chakra-ui/react";
import SelectField from "../components/SelectField";
import {apiUrl} from "../constants/global.ts";
import {TokenContext} from "../Context.tsx";
import GradeSystem from "../interfaces/GradeSystem.ts";

interface SettingsProps {
    groupID: number
}

export default function Settings(props: SettingsProps) {

    const { groupID } = props;

    const [ gradingSystems, setGradingSystems ] = useState<Array<GradeSystem>>([])
    const [ selectedGradingSystem, setSelectedGradingSystem ] = useState<string[]>([])
    const { user, isLoading: userLoading } = useContext(TokenContext)

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

    return(
        <>
            <div>Settings</div>
            <SelectField 
                fields={gradingSystemFields}
                setValue={setSelectedGradingSystem}
                value={selectedGradingSystem}
                label="Grading System"
                placeholder="Select a grading system"
            />
        </>
    )
}