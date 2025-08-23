import { useState, useContext } from "react"
import ReusableButton from "./ReusableButton.tsx";


interface DeleteButtonProps {
    onDelete: () => void,
    disabled?: boolean,
    children?: React.ReactNode,

}


function DeleteButton(props: DeleteButtonProps) {

    const { onDelete, disabled, children } = props

    const [confirmation, setConfirmation] = useState<boolean>(false)


    function handleDeleteClick() {
        if(disabled) {
            return
        }
        onDelete()
        setConfirmation(false)
    }


    if(disabled) {
        return(
            <ReusableButton disabled>Delete Boulder</ReusableButton>
        );
    }
    return(
        <>
            {!confirmation ? (
                <ReusableButton onClick={() => setConfirmation((prev: boolean) => !prev)}>{children}</ReusableButton>
        ) : (
            <>
                <label> Are you sure? </label>
                <ReusableButton onClick={handleDeleteClick}>Yes</ReusableButton>
                <ReusableButton onClick={() => setConfirmation(false)}>No</ReusableButton>
            </>

        )}
        </>
    );
}

export default DeleteButton;