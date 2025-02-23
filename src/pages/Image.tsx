
export default function Image(props) {

    const image = "data:image/png;base64," + props.data.image.toString();
    console.log(props)
    return(
        <>
            {image ? (<img src={image} alt="idk" />
            ) : (
                <></>)
            }
        </>
    );
}