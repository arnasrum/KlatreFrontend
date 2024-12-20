import image from "./boulder.png"
import {apiUrl} from "../constants/global";

export default function ImageViewer() {

    const imageRequest = (event) => {

        fetch(`${apiUrl}/image`, {
            method: "POST",
            headers: {
                "Content-Type": "image/png",
            },
            body: image
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
    }

    return (
        <>
            <button onClick={imageRequest}>Image</button>
        </>
    );
}