import { useState, useEffect, useContext } from 'react'
import "./Boulders.css"
import {GroupContext, TokenContext} from "../Context";
import { apiUrl } from "../constants/global";
import Image from "./Image";
import AddButton from "../components/AddButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import { BoulderContext } from "../Context";
import { convertImageToBase64 } from "../Helpers";
import Boulder from "../interfaces/Boulder";


interface BoulderProps{
    boulders: Array<Boulder>
    setBoulders: Function
}

function Boulders(props: BoulderProps) {

    //const [boulders, setBoulders] = useState<Boulders>({})
    const boulders = props.boulders;
    const setBoulders = props.setBoulders;
    const boulderLength = Object.keys(boulders).length;
    const { user } = useContext(TokenContext)
    const { setRefetch, placeID, groupID, page, setPage } = useContext(GroupContext)


    const boulderContext = {
        boulders: boulders,
        setBoulders: setBoulders,
        page: page,
        setPage: setPage,
        setRefetch: setRefetch,
        boulderLength: boulderLength,
        accessToken: user.access_token,
        placeID: placeID,
    }

   interface Boulders extends Object{
        [key: number]: Boulder
   }

    useEffect(() => {
        if(boulders && boulderLength > 0) {
            setPage((prev) => {
                if(prev == page) {return prev}
                return boulders.length - 1}
            )
        }
    }, [boulders, placeID, groupID])


    const handleNextClick = () => {
        if(page == boulderLength - 1) {return}
        setPage(prevState => prevState + 1)
    }
    const handlePreviousClick = () => {
        if(page == 0) {return}
        setPage(prevState => prevState - 1)
    }

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
                            <button onClick={handlePreviousClick}>Previous Boulder</button>
                            <button onClick={handleNextClick}>Next Boulder</button>
                        </div>
                    )
                ) : (
                    <p>Boulder undefined</p>
                )
            }
            <AddButton/>
            <EditButton/>
            <DeleteButton/>
        </BoulderContext.Provider>
    );
}

export default Boulders;