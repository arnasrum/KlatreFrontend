import ReusableButton from "./ReusableButton.tsx";
import InputField from "../interfaces/InputField.ts";
import ImageField from "./ImageField.tsx"

interface FormProps{
    fields: Array<InputField>,
    handleSubmit: (event: React.FormEvent) => void,
}

function Form({fields, handleSubmit}: FormProps) {

   return(
       <>
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
                                   <input 
                                       type={field.type} 
                                       name={field.name} 
                                       required={field.required}
                                       accept={field.accept} 
                                   />
                               </label>
                           )
                       }})
               }
               <ReusableButton type="submit">Submit</ReusableButton>
           </form>
       </>
   );
}

export default Form;