import React, {useRef, useState, useEffect} from "react"
import { Box, VStack, Button, HStack, Text, Slider, Input } from "@chakra-ui/react"
import SelectField from "./SelectField.tsx";
import GradeSystem from "../interfaces/GradeSystem.ts";
import {Grade} from "../interfaces/Grade.ts";
import ReusableButton from "./ReusableButton.tsx";
import { ValueChangeDetails } from "@chakra-ui/react"

interface CustomGrade {
    id: number;
    gradeString: string;
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
    const customGradeID = useRef(0)
    const [referenceGradeIndexes, setReferenceGradeIndexes] = useState<number[]>([])


    useEffect(() => {
        setCustomGrades([])
    }, [referenceGradeSystem]);

    const gradeSystemFields = gradeSystems.map((gradeSystem: GradeSystem) => {
        return ({"label": gradeSystem.name, "value": gradeSystem.id.toString()})
    })

    const selectedGradeSystem = gradeSystems.find(
        gs => gs.id.toString() === referenceGradeSystem[0]
    )

    function addCustomGrade() {
        if(customGrades.length <= 0) {
            const grade: CustomGrade = {"id": customGradeID.current++, "gradeString": "", "minValue": 0, "maxValue": 0}
            setCustomGrades([...customGrades, grade])
            return
        }
        const customGrade = customGrades[customGrades.length - 1]
        const gradeString = customGrade.gradeString
        const minValue = customGrade.maxValue + 1
        const maxValue =  customGrade.maxValue + 2
        const grade: CustomGrade = {"id": customGradeID.current++, "gradeString": "", "minValue": minValue, "maxValue": maxValue}
        if(grade.maxValue >= selectedGradeSystem.grades.length) {return}
        setCustomGrades([...customGrades, grade])
    }

    function updateSlider(index: number, valueChangeDetails: ValueChangeDetails) {
        const { value } = valueChangeDetails;
        // Use a temporary array to build the new state
        const tempGrades = [...customGrades];

        const [minValue, maxValue] = value;
        if(minValue < 0 || maxValue < 0) {return}
        const gradeToUpdate = tempGrades[index];

        // Check if the min value has changed and update the current grade
        if (minValue !== undefined && minValue !== gradeToUpdate.minValue) {
            if(minValue - 1 < 0) {return}

            gradeToUpdate.minValue = minValue;

            // Update the previous grade's max value immutably
            if (index > 0) {
                tempGrades[index - 1] = {
                    ...tempGrades[index - 1],
                    maxValue: minValue - 1
                };
            }
        }

        // Check if the max value has changed and update the current grade
        const updatedMaxValue = value.length === 1 ? minValue : maxValue;

        if (updatedMaxValue !== undefined && updatedMaxValue !== gradeToUpdate.maxValue) {
            gradeToUpdate.maxValue = updatedMaxValue;

            // Update the next grade's min value immutably
            if (index < tempGrades.length - 1) {
                tempGrades[index + 1] = {
                    ...tempGrades[index + 1],
                    minValue: updatedMaxValue + 1
                };
            }
        }

        // Final check to prevent overlap and ensure constraints
        // This logic is crucial for handling large jumps
        if (index > 0) {
            const prevGrade = tempGrades[index - 1];
            if (gradeToUpdate.minValue <= prevGrade.maxValue) {
                // Clamp the min value of the current grade
                if(prevGrade.maxValue + 1 > selectedGradeSystem.grades.length - 1) {return}
                gradeToUpdate.minValue = prevGrade.maxValue + 1;
            }
        }

        if (index < tempGrades.length - 1) {
            const nextGrade = tempGrades[index + 1];
            if (gradeToUpdate.maxValue >= nextGrade.minValue) {
                // Clamp the max value of the current grade
                if(nextGrade.minValue - 1 <= 0) {return}
                gradeToUpdate.maxValue = nextGrade.minValue - 1;
            }
        }

        setCustomGrades(tempGrades);
    }



    function gradeSlider(index: number, customGrade: CustomGrade, referenceGradeSystem: GradeSystem): React.ReactNode {
        if(!referenceGradeSystem) {return(<></>)}
        const marks = referenceGradeSystem.grades.map((grade, index) => {
            return {"label": grade.gradeString, "value": index}
        })
        const numGrades = marks.length;



        const defaultValues = []
        const values = []
        //const defaultValues = [0]
        //const values = [0]
        if(index === 0) {
            defaultValues.push(0)
            values.push(customGrade.maxValue)
        } else {
            const prevGrade = customGrades[index - 1]
            defaultValues.push(prevGrade.maxValue + 1, prevGrade.maxValue + 1)
            values.push(customGrade.minValue, customGrade.maxValue)
        }

        return(
            <Box display={"flex"} key={customGrade.id} flexDir="row" p={4} width="auto">
                <Input  placeholder={"Grade"} width="1/12" value={customGrade.gradeString} onChange={(e) => {updateGradeString(index, e.target.value)}} />
                <Slider.Root
                    minStepsBetweenThumbs={1}
                    minW={"md"}
                    alignItems="center"
                    min={0}
                    max={numGrades - 1}
                    step={null}
                    width="full"
                    defaultValue={defaultValues}
                    value={values}
                    onValueChange={(details) => {updateSlider(index, details)}}
                >
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Range />
                        </Slider.Track>
                        <Slider.Thumbs />
                        <Slider.Marks marks={marks} />
                    </Slider.Control>
                </Slider.Root>
                <Button variant="solid"
                        bgColor="fg.error"
                        color="fg"
                        onClick={() => {removeGrade(customGrade.id)}}
                >Remove Grade</Button>
            </Box>
        )
    }

    function removeGrade(id: number) {
        setCustomGrades(prev => prev.filter(grade => grade.id !== id))
    }

    function updateGradeString(index: number, gradeString: string) {
        customGrades[index].gradeString = gradeString
        setCustomGrades([...customGrades])
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
                <ReusableButton onClick={() => addCustomGrade()}>Add Custom Grade</ReusableButton>
                {customGrades.map((grade, index) => {
                    return(gradeSlider(index, grade, selectedGradeSystem as GradeSystem))
                })}
            </VStack>
        </Box>
    )
}

export default GradeCreation;