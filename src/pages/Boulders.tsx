import { useState, useEffect } from 'react'
import "./Boulders.css"
import Image from "./Image.tsx";
import AddButton from "../components/AddButton.tsx";
import EditButton from "../components/EditButton.tsx";
import DeleteButton from "../components/DeleteButton.tsx";
import Boulder from "../interfaces/Boulder.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import BoulderData from "../interfaces/BoulderData.ts";
import RouteSends from "./RouteSends.tsx";


interface BoulderProps{
    boulderData: Array<BoulderData> | undefined
    isLoading?: boolean // Add this
    placeID: number,
    refetchBoulders: () => void

}

function Boulders(props: BoulderProps) {
    const { placeID, boulderData, refetchBoulders, isLoading = false } = props
    const boulders: Array<Boulder> | undefined = boulderData?.map((boulder: BoulderData) => boulder.boulder)
    const boulderLength = boulders?.length || 0
    const [page, setPage] = useState<number>(0)

    useEffect(() => {
        setPage(0)
    }, [placeID, boulderData]);

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

    if (isLoading) {
        return <div>Loading boulders...</div>
    }

    return(
        <>
            {boulders && boulderLength > 0 && page < boulderLength ? (
                <div>
                    <h3>{boulders[page].name}</h3>
                    <div className="Boulder">
                        <ul className="flex-items">
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
            ) : (
                <p>No boulders</p>

            )}
            { boulderData && boulderData[page] && (
                <RouteSends routeSend={boulderData[page].routeSend} boulderID={boulderData[page].boulder.id}/>
            )}

            <AddButton page={page} setPage={setPage} boulders={boulders} refetchBoulders={refetchBoulders} placeID={placeID}/>
            <EditButton page={page} boulders={boulders} refetchBoulders={refetchBoulders}/>
            <DeleteButton page={page} setPage={setPage} boulders={boulders} refetchBoulders={refetchBoulders}/>
        </>
    );
}

export default Boulders;