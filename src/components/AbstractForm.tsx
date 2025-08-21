import ReusableButton from "./ReusableButton.tsx";
import InputField from "../interfaces/InputField.ts";

interface FormProps{
    fields: Array<InputField>,
    handleSubmit: (event: React.FormEvent) => void,
}

function Form({fields, handleSubmit}: FormProps) {


   return(
       <>
           <form onSubmit={handleSubmit}>
               {
                   fields.map((field: InputField, index: number) => {
                       return (
                           <label key={index}>
                               {field.label}
                               <input key={index} type={field.type} name={field.name}/>
                           </label>
                       )
                   })
               }
               <ReusableButton type="submit">Submit</ReusableButton>
           </form>
       </>
   );
}

export default Form;