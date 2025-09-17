import {Box, Heading, Tabs} from "@chakra-ui/react";
import React, {Dispatch, SetStateAction, useState} from "react";
import GradeCreation from "./GradeCreation.tsx";
import GradeSystem from "../interfaces/GradeSystem.ts";
import EditGradingSystem from "./EditGradingSystem.tsx";

interface ManageGradingSystemsProps {
    gradingSystems: GradeSystem[],
    groupID: number,
    refetch: () => void
}


function ManageGradingSystems(
    {gradingSystems, groupID, refetch}: ManageGradingSystemsProps
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
                    <EditGradingSystem
                        groupID={groupID}
                        gradeSystems={gradingSystems.filter(item => item.isGlobal == false)}
                        refetch={refetch}
                    />
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    )
}

export default ManageGradingSystems;