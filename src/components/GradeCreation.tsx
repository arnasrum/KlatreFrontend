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
        setCustomGrades([...customGrades, grade])
    }


    function checkIfMoveIsValid(index: number, minMoved: boolean, maxMoved: boolean) {
        if(index === 0 && customGrades.length === 1) {
            return true
        }
        if(minMoved) {
            const prevGrade = customGrades[index - 1]
            return prevGrade.minValue != prevGrade.maxValue - 1
        } else if(maxMoved) {
            const nextGrade = customGrades[index + 1]
            return nextGrade.minValue != nextGrade.maxValue - 1
        }
        return false
    }


    function updateSlider(index: number, valueChangeDetails: ValueChangeDetails) {
        const test = customGrades.map((grade, gradeIndex) => {
            if(index == gradeIndex) {
                let minMoved = false
                let maxMoved = false
                if(valueChangeDetails.value.length == 2) {
                    minMoved = valueChangeDetails.value[0] != customGrades[index].minValue
                }
                if(index == 0 && valueChangeDetails.value[0] != grade.maxValue) {
                    maxMoved = true
                }

                if(valueChangeDetails.value.length > 1 || valueChangeDetails.value.length == 0) {
                    maxMoved = valueChangeDetails.value[1] != customGrades[index].maxValue
                }
                if(minMoved) {
                    if(valueChangeDetails.value[0] > 1) {return grade}
                    if(index == 0) {return grade}
                    if(!checkIfMoveIsValid(index, minMoved, maxMoved) && valueChangeDetails) {return grade}

                    grade.minValue = valueChangeDetails.value[0]
                    const prevGrade = customGrades[index - 1]
                    prevGrade.maxValue = grade.minValue - 1
                    return grade
                }
                if(maxMoved) {
                    if(index == 0) {
                        if(valueChangeDetails.value[0] < customGrades[index].maxValue) {
                            grade.maxValue = valueChangeDetails.value[0]
                            if(customGrades.length > 1) {
                                customGrades[index + 1].minValue = grade.maxValue + 1
                            }
                            return grade
                        }
                        if(!checkIfMoveIsValid(index, minMoved, maxMoved) && customGrades.length > 1) {return grade}
                        grade.maxValue = valueChangeDetails.value[0]
                        if(customGrades.length > 1) {
                            customGrades[index + 1].minValue = grade.maxValue + 1
                        }
                    } else if(valueChangeDetails.value[1] < customGrades[index].maxValue) {
                        grade.maxValue = valueChangeDetails.value[1]
                        if(index < customGrades.length - 1) {
                            customGrades[index + 1].minValue = grade.maxValue + 1
                        }
                    } else if(index == customGrades.length - 1) {
                        grade.maxValue = valueChangeDetails.value[1]
                    } else {
                        if(!checkIfMoveIsValid(index, minMoved, maxMoved)) {return grade}
                        grade.maxValue = valueChangeDetails.value[1]
                        const nextGrade = customGrades[index + 1]
                        nextGrade.minValue = grade.maxValue + 1
                    }

                }
            }
            return grade
        })
        setCustomGrades(test)
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