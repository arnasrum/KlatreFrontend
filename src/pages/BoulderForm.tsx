
function BoulderForm(props) {
    const handleSubmit = props.handleSubmit
    const boulders = props.boulders
    const page = props.page
    const defaultValues = props.defaultValues

    return(
        <>
            {
                defaultValues ? (
                    <form onSubmit={handleSubmit}>
                        <label>
                            name:
                            <input id="name" defaultValue={boulders[page].name}/>
                        </label>
                        <label>
                            attempts:
                            <input id="attempts" defaultValue={boulders[page].attempts}/>
                        </label>
                        <label>
                            grade:
                            <input id="grade" defaultValue={boulders[page].grade}/>
                        </label>
                        <label>
                            Image:
                            <input id="image" type="file" onClick={() => {
                            }}/>
                        </label>
                        <button type={"submit"}>Submit</button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label>
                            name:
                            <input id="name"/>
                        </label>
                        <label>
                            attempts:
                            <input id="attempts"/>
                        </label>
                        <label>
                            grade:
                            <input id="grade"/>
                        </label>
                        <label>
                            Image:
                            <input id="image" type="file" onClick={() => {
                            }}/>
                        </label>
                        <button type={"submit"}>Submit</button>
                    </form>

                )
            }


        </>
    )

}

export default BoulderForm