import React, { useState } from "react";
import {Input, Field, VStack, Box, Checkbox, HStack} from "@chakra-ui/react";
import type InputField from "../interfaces/InputField.ts";
import ImageField from "./ImageField.tsx"
import SelectField from "./SelectField.tsx";

interface FormProps{
    fields: Array<InputField>,
    handleSubmit: (event: React.FormEvent) => void,
    footer?: React.ReactNode,
    width?: string
}

interface SelectFieldType {    fields: Array<InputField>,
    options: { label: string, value: string, description?: string}[],
    value: string,
    setValue: (value: string) => void,
    name: string,
    label: string,
    placeholder: string,
    disabled: boolean,
    type: "select"
}

function Form({fields, handleSubmit, footer, width}: FormProps) {

    const [selectValues, setSelectValues] = useState<Record<string, string[]>>({});

    const handleSelectChange = (fieldName: string, value: string[]) => {
        setSelectValues(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        // Add hidden inputs for select fields to the form data
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        
        // Add select values to form data
        Object.entries(selectValues).forEach(([fieldName, values]) => {
            formData.set(fieldName, values.join(','));
        });
        
        handleSubmit(event);
    };

    return(
       <Box 
         as="form" 
         onSubmit={onSubmit} 
         p={6}
         bg="white"
         borderRadius="lg"
         shadow="md"
         border="1px"
         borderColor="gray.200"
         w={width}
       >
           <VStack gap={4} align="stretch">

               {fields.some(field => field.type == "select") && (
                   <>
                       {Object.entries(selectValues).map(([fieldName, values]) => (
                           <input
                               type="hidden"
                               key={fieldName}
                               name={fieldName}
                               value={values.join(',')} 
                           />
                       ))}
                   </>
               )}
               {fields.map((field: (InputField), index: number) => {
                   if(field.type == "image") {
                        return(
                            <Box key={field.name || index}>
                                <ImageField name="image" />
                            </Box>
                        );
                   } else if(field.type == "select") {
                        const fieldName = field.name || `select-${index}`;
                        const currentValue = selectValues[fieldName] || [];
                        return(
                            <Field.Root key={field.name || index} width="full" required={field.required} w="full">
                                <Field.Label
                                    fontWeight="semibold"
                                    color="gray.700"
                                    mb={2}
                                >
                                    {field.label}
                                    {field.required && <Field.RequiredIndicator color="red.500"/>}
                                </Field.Label>
                                <SelectField
                                    fields={field.options}
                                    setValue={(value) => handleSelectChange(fieldName, value)}
                                    value={currentValue}
                                    placeholder={field.placeholder}
                                    disabled={field.disabled}
                                    width="full"
                                    zIndex={9000}
                                />
                            </Field.Root>

                        )
                   } else if(field.type == "checkbox") {
                       return(
                           <Field.Root key={field.name || index} width="full" required={field.required} w="full">

                               <Checkbox.Root>
                                   <HStack>
                                       <Checkbox.Label color="fg">
                                           {field.label}
                                           {field.required && <Field.RequiredIndicator color="red.500"/>}
                                       </Checkbox.Label>
                                       <Checkbox.Control />
                                   </HStack>
                                   <Checkbox.HiddenInput name={field.name} />
                                   <Field.HelperText color="gray.600" fontSize="sm" />
                                   <Field.ErrorText color="red.500" fontSize="sm">
                                       This field is required
                                   </Field.ErrorText>
                               </Checkbox.Root>
                           </Field.Root>
                       )

                   } else {
                       return (
                           <Field.Root key={field.name || index} required={field.required}>
                               <Field.Label 
                                 fontWeight="semibold"
                                 color="gray.700"
                                 mb={2}
                               >
                                   {field.label}
                                   {field.required && <Field.RequiredIndicator color="red.500"/>}
                               </Field.Label>
                               <Input
                                   type={field.type}
                                   name={field.name}
                                   required={field.required}
                                   accept={field.accept}
                                   placeholder={field.placeholder}
                                   size="md"
                                   bg="gray.50"
                                   border="1px"
                                   borderColor="gray.300"
                                   color="fg"
                                   _hover={{
                                     borderColor: "gray.400"
                                   }}
                                   _focus={{
                                     borderColor: "blue.500",
                                     boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                                     bg: "white"
                                   }}
                               />
                               <Field.HelperText color="gray.600" fontSize="sm" />
                               <Field.ErrorText color="red.500" fontSize="sm">
                                 This field is required
                               </Field.ErrorText>
                           </Field.Root>
                       )
                   }
               })}
               
               {footer && (
                   <Box pt={4} borderTop="1px" borderColor="gray.200">
                       {footer}
                   </Box>
               )}
           </VStack>
       </Box>
   );
}

export default Form;