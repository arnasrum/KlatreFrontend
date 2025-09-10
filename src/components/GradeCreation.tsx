import React, { useState } from "react"
import { Box, VStack, HStack, Text, Slider, Input } from "@chakra-ui/react"
import SelectField from "./SelectField.tsx";
import GradeSystem from "../interfaces/GradeSystem.ts";
import {Grade} from "../interfaces/Grade.ts";
import ReusableButton from "./ReusableButton.tsx";

interface CustomGrade {
    id: number;
    gradeString: string;
    numericGrade: number;
    minValue: number;
    maxValue: number;
}

interface GradeCreationProps {
    gradeSystems: GradeSystem[],
}

function GradeCreation({
    gradeSystems
}: GradeCreationProps) {
    const [referenceGradeSystem, setReferenceGradeSystem] = useState<string[]>([])
    const [customGrades, setCustomGrades] = useState<Array<CustomGrade>>([])

    const gradeSystemFields = gradeSystems.map((gradeSystem: GradeSystem) => {
        return ({"label": gradeSystem.name, "value": gradeSystem.id.toString()})
    })

    const selectedGradeSystem = gradeSystems.find(
        gs => gs.id.toString() === referenceGradeSystem[0]
    )

    function gradeSlider(customGrade: CustomGrade): React.ReactNode {
        return(
            <Slider.Root>

            </Slider.Root>
        )
    }

    return (
        <Box>
            <VStack gap={6} align="stretch">
                <SelectField
                    fields={gradeSystemFields}
                    value={referenceGradeSystem}
                    setValue={setReferenceGradeSystem}
                    label="Reference Grade System"
                    zIndex={9000}
                />
                <ReusableButton >Add Custom Grade</ReusableButton>
                {customGrades.map(grade => {
                    return(<span id={grade.id.toString()}>{grade.gradeString}</span>)
                })}
            </VStack>
        </Box>
    )
}

export default GradeCreation;