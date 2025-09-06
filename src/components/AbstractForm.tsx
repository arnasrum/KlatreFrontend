import React from "react";
import { Input, Field, VStack, Box } from "@chakra-ui/react";
import type InputField from "../interfaces/InputField.ts";
import ImageField from "./ImageField.tsx"

interface FormProps{
    fields: Array<InputField>,
    handleSubmit: (event: React.FormEvent) => void,
    footer?: React.ReactNode,
}

function Form({fields, handleSubmit, footer}: FormProps) {
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
       >
           <VStack spacing={4} align="stretch">
               {fields.map((field: InputField, index: number) => {
                   if(field.type == "image") {
                        return(
                            <Box key={field.name || index}>
                                <ImageField name="image" />
                            </Box>
                        );
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