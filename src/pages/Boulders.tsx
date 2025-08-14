import { useState, useEffect, useContext } from 'react'
import "./Boulders.css"
import {GroupContext, TokenContext, BoulderContext } from "../Context.tsx";
import Image from "./Image.tsx";
import AddButton from "../components/AddButton.tsx";
import EditButton from "../components/EditButton.tsx";
import DeleteButton from "../components/DeleteButton.tsx";
import Boulder from "../interfaces/Boulder.ts";
import ReusableButton from "../components/ReusableButton.tsx";


interface BoulderProps{
    boulders: Array<Boulder> | null
    setBoulders: React.Dispatch<any>,
    isLoading?: boolean // Add this
    placeID: number,
    refetchBoulders: () => void

}

function Boulders(props: BoulderProps) {
    const { placeID, boulders, setBoulders, refetchBoulders, isLoading = false } = props
    const boulderLength = boulders?.length || 0
    const { user } = useContext(TokenContext)
    const [page, setPage] = useState<number>(0)


    const boulderContext = {
        boulders: boulders,
        setBoulders: setBoulders,
        page: page,
        setPage: setPage,
        boulderLength: boulderLength,
        accessToken: user.access_token,
        placeID: placeID,
    }

    useEffect(() => {
        setPage(0)
    }, [placeID]);

    useEffect(() => {
        if(boulders && boulderLength > 0) {
            setPage((prev: number) => {
                if(prev == page) {return prev}
                return boulders.length - 1}
            )
        }
    }, [boulders])


    const handleNextClick = () => {
        if(page == boulderLength - 1) {return}
        setPage((prevState: number) => prevState + 1)
    }
    const handlePreviousClick = () => {
        if(page == 0) {return}
        setPage((prevState: number) => prevState - 1)
    }

    // In your render logic:
    if (isLoading) {
        return <div>Loading boulders...</div>
    }

    console.log("boulders: ", boulders)
    return(
        <BoulderContext.Provider value={boulderContext}>
            {
                boulders ? (
                    boulderLength < 1 ? (
                        <p>Please insert some boulders</p>
                    ) : (
                        <div>
                            <h3>{boulders[page].name}</h3>
                            <div className="Boulder">
                                <ul className="flex-items">
                                    <li>Attempts: {boulders[page].attempts}</li>
                                    <li>Grade: {boulders[page].grade}</li>
                                </ul>
                                <div>
                                    <Image className="flex-items" data={boulders[page].image}/>
                                </div>
                            </div>
                            <p>Page {page + 1} of {boulderLength}</p>
                            <ReusableButton onClick={handlePreviousClick} type="button">Previous Boulder</ReusableButton>
                            <ReusableButton onClick={handleNextClick} type="button">Next Boulder</ReusableButton>
                        </div>
                    )
                ) : (
                    <p>Boulder undefined</p>
                )
            }
            <AddButton page={page} setPage={setPage} boulders={boulders} placeID={placeID} refetchBoulders={refetchBoulders}/>
            <EditButton page={page} boulders={boulders} placeID={placeID} refetchBoulders={refetchBoulders}/>
            <DeleteButton page={page} setPage={setPage} boulders={boulders} refetchBoulders={refetchBoulders}/>
        </BoulderContext.Provider>
    );
}

export default Boulders;