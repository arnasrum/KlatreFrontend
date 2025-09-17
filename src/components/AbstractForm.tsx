import React from "react";
import { Input, Field, VStack, Box } from "@chakra-ui/react";
import type InputField from "../interfaces/InputField.ts";
import ImageField from "./ImageField.tsx"
import SelectField from "./SelectField.tsx";

interface FormProps{
    fields: Array<InputField>,
    handleSubmit: (event: React.FormEvent) => void,
    footer?: React.ReactNode,
    width?: string
}

interface SelectFieldType {
    options: { label: string, value: string}[],
    value: string,
    setValue: (value: string) => void,
    name: string,
    label: string,
    placeholder: string,
    disabled: boolean,
    type: "select"
}

function Form({fields, handleSubmit, footer, width}: FormProps) {
   return(
       <Box 
         as="form" 
         onSubmit={handleSubmit} 
         p={6}
         bg="white"
         borderRadius="lg"
         shadow="md"
         border="1px"
         borderColor="gray.200"
         w={width}
       >
           <VStack gap={4} align="stretch">
               {fields.map((field: (InputField), index: number) => {
                   if(field.type == "image") {
                        return(
                            <Box key={field.name || index}>
                                <ImageField name="image" />
                            </Box>
                        );
                   } else if(field.type == "select") {
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
                                    setValue={field.setter}
                                    value={field.value}
                                    placeholder={field.placeholder}
                                    disabled={field.disabled}
                                    width="full"
                                />
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