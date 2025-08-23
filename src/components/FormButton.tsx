import { useState } from 'react';
import ReusableButton from "./ReusableButton.tsx";
import AbstractForm from "./AbstractForm.tsx";
import InputField from "../interfaces/InputField.ts";

interface FormButtonProps {
    children: React.ReactNode,
    formSubmit: (event: any) => void,
    fields: Array<InputField>,

}



function EditButton( props : FormButtonProps) {

    const { children, formSubmit, fields } = props
    const [showForm, setShowForm] = useState<boolean>(false)

    function handleSubmit(event: any) {
        event.preventDefault()
        formSubmit(event)
        setShowForm(false)
    }

    return (
        <div>
            {showForm ? (
                <AbstractForm fields={fields} handleSubmit={handleSubmit} />
            ) : (
                <></>
            )}
            <ReusableButton onClick={() => {setShowForm(prev => !prev)}}>{children}</ReusableButton>
        </div>
    );
}

export default EditButton;