import React, { useState, useContext } from 'react';
import {apiUrl} from "../constants/global.ts";
import "./AddGroupFrom.css"

function AddGroupForm() {
    const { refetch, setRefetch, setShowGroupModal } = useContext(GroupContext);
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [emailInput, setEmailInput] = useState('');

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (emailInput.trim() && isValidEmail(emailInput.trim())) {
            addEmail(emailInput.trim());
        }

        const formData = new FormData(e.currentTarget);
        fetch(`${apiUrl}/groups`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.access_token
            },
            body: JSON.stringify({
                "name": formData.get("name") as string,
                "description": formData.get("description") as string,
                "invites": selectedEmails
            })
        })
            .then(_ => console.log("Group added"))
            .then(_ => {
                setSelectedEmails([]);
                setEmailInput('');
                setRefetch(!refetch);
                setShowGroupModal(false);
            })
            .catch(error => console.error(error))
    };

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const addEmail = (email: string) => {
        if (email && !selectedEmails.includes(email) && isValidEmail(email)) {
            setSelectedEmails([...selectedEmails, email]);
            setEmailInput('');
        }
    };

    const removeEmail = (index: number) => {
        if(index === 0) {
            setSelectedEmails(selectedEmails.splice(1, selectedEmails.length - 1));
            return
        }
        setSelectedEmails(selectedEmails.splice(0, index).concat(selectedEmails.splice(index, selectedEmails.length - 1)));
    };


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailInput(event.currentTarget.value)
    }

    return (
        <div className="main">
            <h2>Add Group</h2>
            <form onSubmit={handleFormSubmit}>
                <label>
                    Name:
                    <input id="name" key="name" type="text" name="name" required/>
                </label>
                <label>
                    Description:
                    <textarea id="description" name="description"/>
                </label>
                <label>
                    Invite People (Email addresses):
                    <input id="emails" value={emailInput} onChange={handleInputChange} placeholder="Enter email addresses" />
                    <div>
                        {selectedEmails.map((email: string, index: number) => {
                            return(
                                <span
                                    key={index}
                                    className="mails"
                                    onClick={() => removeEmail(index)}
                                >
                                    {email}
                                </span>
                            )
                        })}
                        <button type="button" onClick={() => addEmail(emailInput)}>Add</button>
                    </div>
                </label>
                <button type="submit">Add Group</button>
            </form>
        </div>
    );
}

export default AddGroupForm;