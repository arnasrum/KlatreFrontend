import React, {useRef, useState, useEffect, useContext} from "react"
import {apiUrl} from "../constants/global.ts"
import {Separator, Box, VStack, Button, Field, Slider, Input, EmptyState} from "@chakra-ui/react"
import SelectField from "./SelectField.tsx";
import GradeSystem from "../interfaces/GradeSystem.ts";
import ReusableButton from "./ReusableButton.tsx";
// @ts-ignore
import {ValueChangeDetails} from "@chakra-ui/react"
import {VscEmptyWindow} from "react-icons/vsc";
import {toaster, Toaster} from "./ui/toaster.tsx";

interface CustomGrade {
    id: number,
    gradeString: string,
    minValue: number,
    maxValue: number,
}

interface GradeCreationProps {
    gradeSystems: GradeSystem[],
    groupID: number,
    modalSetter: (arg: boolean) => void,
    refetch: () => void,
}

function GradeCreation({
                       gradeSystems,
                       groupID,
                       modalSetter,
                       refetch,
                       }: GradeCreationProps) {
    const [referenceGradeSystem, setReferenceGradeSystem] = useState<string[]>([])
    const [customGrades, setCustomGrades] = useState<Array<CustomGrade>>([])
    const [customGradeSystemName, setCustomGradeSystemName] = useState<string>("")
    const customGradeID = useRef(0)


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
        if (!selectedGradeSystem) {
            toaster.create({
                title: "Failed to add a custom grade",
                description: "Please select a grade system",
                type: "error",
                duration: 5000,
            })
            return
        }
        if (customGrades.length <= 0) {
            const grade: CustomGrade = {"id": customGradeID.current++, "gradeString": "", "minValue": 0, "maxValue": 0}
            setCustomGrades([...customGrades, grade])
            return
        }
        const minValue = 0
        const maxValue = 1
        const grade: CustomGrade = {
            "id": customGradeID.current++,
            "gradeString": "",
            "minValue": minValue,
            "maxValue": maxValue
        }
        if (grade.maxValue >= selectedGradeSystem.grades.length) {
            return
        }
        setCustomGrades([...customGrades, grade])
    }

    function updateSlider(index: number, valueChangeDetails: ValueChangeDetails) {
        const {value} = valueChangeDetails;
        // Use a temporary array to build the new state
        const tempGrades = [...customGrades];

        const [minValue, maxValue] = value;
        if (minValue < 0 || maxValue < 0) {
            return
        }

        const gradeToUpdate = tempGrades[index];
        tempGrades[index] = {
            ...gradeToUpdate,
            minValue: minValue,
            maxValue: maxValue
        }
        setCustomGrades(tempGrades);
    }

    function gradeSlider(index: number, customGrade: CustomGrade, referenceGradeSystem: GradeSystem): React.ReactNode {
        if (!referenceGradeSystem) {
            return (<></>)
        }
        const marks = referenceGradeSystem.grades.map((grade, index) => {
            return {"label": grade.gradeString, "value": index}
        })
        const numGrades = marks.length;
        const defaultValues = [0, 1]
        const values = [customGrade.minValue, customGrade.maxValue]

        return (
            <Box key={customGrade.id} p={4} width="auto">
                <Field.Root width="full" required mb={4}>
                    <Input
                        placeholder={"Grade"}
                        value={customGrade.gradeString}
                        onChange={(e) => {
                            updateGradeString(index, e.target.value)
                        }}
                    />
                    <Field.ErrorText>Please give the grade a name</Field.ErrorText>
                </Field.Root>

                <Box display="flex" flexDir="row" alignItems="center" gap={2}>
                    <Slider.Root
                        minStepsBetweenThumbs={0}
                        minW={"md"}
                        alignItems="center"
                        min={0}
                        max={numGrades - 1}
                        step={null}
                        width="full"
                        defaultValue={defaultValues}
                        value={values}
                        onValueChange={(details) => {
                            updateSlider(index, details)
                        }}
                        flex="1"
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range/>
                            </Slider.Track>
                            <Slider.Thumbs/>
                            <Slider.Marks marks={marks}/>
                        </Slider.Control>
                    </Slider.Root>
                    <Button variant="solid"
                            bgColor="fg.error"
                            color="fg"
                            onClick={() => {
                                removeGrade(customGrade.id)
                            }}
                            flexShrink={0}
                    >X</Button>
                </Box>
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

    function submit() {
        if (customGrades && customGrades.filter(grade => grade.gradeString == "").length > 0) {
            toaster.create({
                title: "Failed to add the custom grading system",
                description: "Custom Grades have to contain a name",
                type: "error",
                duration: 5000,
            })
            return
        }
        if (!customGradeSystemName) {
            toaster.create({
                title: "Failed to add the custom grading system",
                description: "Please give the custom grading system a name",
                type: "error",
                duration: 5000,
            })
            return
        }


        const formData = new FormData();
        const newGrades = customGrades.map((grade) => {
            return {name: grade.gradeString, from: grade.minValue.toString(), to: grade.maxValue.toString()}
        })
        formData.set("groupId", groupID.toString())
        formData.set("referenceGradeSystemID", referenceGradeSystem[0])
        formData.set("newGradeSystemName", customGradeSystemName)
        formData.set("grades", JSON.stringify(newGrades))
        fetch(`${apiUrl}/api/gradingSystems/grades`, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": "Bearer " + user.access_token,
            }
        })
            .then(data => {
                console.log("data", data)
            })
            .then(() => refetch())
            .then(() => modalSetter(false))
            .then(() => toaster.create({
                title: "Custom Grade System Created",
                description: "The custom grade system has been created",
                type: "success",
            }))
            .catch(error => console.error(error))
    }

    return (
        <Box>
            <VStack align="stretch">
                <Box display={"flex"} flexDir="row" p={4} width="auto">
                    <Box w="1/2">
                        <SelectField
                            fields={gradeSystemFields}
                            value={referenceGradeSystem}
                            setValue={setReferenceGradeSystem}
                            label="Reference Grade System"
                            zIndex={9000}
                        />
                    </Box>
                    <Box w="1/2">
                        <label style={{justifySelf: "center", backgroundColor: ""}}>
                            New Grade System Name:
                            <Input
                                placeholder={"New grading system name"}
                                onChange={(event) => setCustomGradeSystemName(event.target.value)}
                                m={5}
                                required
                            ></Input>
                        </label>
                    </Box>
                </Box>
                <Separator m={2}/>
                <ReusableButton onClick={() => addCustomGrade()}>Add Custom Grade</ReusableButton>
                {customGrades.map((grade, index) => {
                    return (gradeSlider(index, grade, selectedGradeSystem as GradeSystem))
                })}
                {customGrades.length == 0 && (
                    <EmptyState.Root>
                        <EmptyState.Content>
                            <EmptyState.Indicator>
                                <VscEmptyWindow size="100px"/>
                            </EmptyState.Indicator>
                            <EmptyState.Title>Add Custom Grades </EmptyState.Title>
                        </EmptyState.Content>
                    </EmptyState.Root>

                )}
            </VStack>
            <ReusableButton style={{"margin": 4}} onClick={submit}>Save</ReusableButton>
            <Toaster/>
        </Box>
    )
}

export default GradeCreation;