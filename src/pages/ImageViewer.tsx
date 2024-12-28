import { useContext } from "react"
import {apiUrl} from "../constants/global";
import {TokenContext} from "../Context";

export default function ImageViewer() {

    const { user } = useContext(TokenContext)

    function uploadImage(event) {
        //const fileInput = document.getElementById('fileInput');
        event.preventDefault()
        // Make sure a file is selected
        if (event.target.fileInput.files.length === 0) {
            alert('Please select an image file.');
            return;
        }
        const formData = new FormData();
        formData.append('image', event.target.fileInput.files[0]);
        fetch(apiUrl + '/image' + "?" + "access_token=" + user.access_token, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.body.getReader().read().then(params => {
                const done = params.done
                const value = params.value
                if(params.done) {

                }

        }))
            .then(responseBody => console.log(responseBody))
            .catch(error => console.error(error))
    }


    return (
        <>
            <form onSubmit={uploadImage} >
                <input type="file" id="fileInput" accept="image/png"/>
                <button type={"submit"}>Upload</button>
            </form>
        </>
    );
}