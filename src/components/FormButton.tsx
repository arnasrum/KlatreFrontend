import { useState } from 'react';
import ReusableButton from "./ReusableButton.tsx";
import AbstractForm from "./AbstractForm.tsx";
import InputField from "../interfaces/InputField.ts";

interface FormButtonProps {
    children: React.ReactNode,
    formSubmit: (event: React.FormEvent) => void,
    fields: Array<InputField>,
}

function FormButton( props : FormButtonProps) {

    const { children, formSubmit, fields } = props
    const [showForm, setShowForm] = useState<boolean>(false)

    function handleSubmit(event: React.FormEvent) {
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

export default FormButton;