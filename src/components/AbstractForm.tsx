import React from "react";
import ReusableButton from "./ReusableButton.tsx";
import type InputField from "../interfaces/InputField.ts";
import ImageField from "./ImageField.tsx"
import {Input, NativeSelect} from "@chakra-ui/react";

interface FormProps{
    fields: Array<InputField>,
    handleSubmit: (event: React.FormEvent) => void,
    footer?: React.ReactNode,
}

function Form({fields, handleSubmit, footer}: FormProps) {

    const aspectRatios = [{"value": 16/9, "label": "16/9"},
        {"value": 4/3, "label": "4/3"},]
    const imageIncluded = fields.filter(field => field.type == "image").length > 0

   return(
       <form onSubmit={handleSubmit} id="form">
           {
               fields.map((field: InputField, index: number) => {
                   if(field.type == "image") {
                        return(
                            <ImageField
                                key={field.name || index}
                                name="image"
                            />
                        );
                   } else {
                       return (
                           <label key={field.name || index}>
                               {field.label}
                               <Input
                                   type={field.type}
                                   name={field.name}
                                   required={field.required}
                                   accept={field.accept}
                                   placeholder={field.placeholder}
                               />
                           </label>
                       )
                   }})
           }
           { footer && (
               <div>
                   {footer}
               </div>
           )}
       </form>
   );
}

export default Form;