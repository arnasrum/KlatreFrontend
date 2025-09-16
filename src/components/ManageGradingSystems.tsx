import {Box, Heading, Tabs} from "@chakra-ui/react";
import React, {useState} from "react";
import GradeCreation from "./GradeCreation.tsx";
import GradeSystem from "../interfaces/GradeSystem.ts";

interface ManageGradingSystemsProps {
    gradingSystems: GradeSystem[],
    groupID: string,
    modalSetter: (value: boolean) => void,
    refetch: () => void,
}


function ManageGradingSystems(
    {gradingSystems, groupID, modalSetter, refetch}: ManageGradingSystemsProps
) {

    const [currentTab, setCurrentTab] = useState<"add" | "edit">("add");

    return (
        <Box>
            <Tabs.Root value={currentTab} onValueChange={(details) => setCurrentTab(details.value)} fitted>
                <Tabs.List>
                    <Tabs.Trigger value="add">Add Grading System</Tabs.Trigger>
                    <Tabs.Trigger value="edit">Manage Grading System</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="add">
                    <GradeCreation gradeSystems={gradingSystems.filter(item => item.isGlobal == true)} groupID={groupID} modalSetter={() => {}} refetch={refetch}/>
                </Tabs.Content>
                <Tabs.Content value="edit">
                    <Heading>Edit</Heading>
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    )
}

export default ManageGradingSystems;