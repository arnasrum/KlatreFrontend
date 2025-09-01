import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useLocation } from "react-router";
import DeleteButton from "../components/DeleteButton.tsx";
import type Boulder from "../interfaces/Boulder.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import type {BoulderData} from "../interfaces/BoulderData.ts";
import RouteSends from "./RouteSends.tsx";
import {apiUrl} from "../constants/global.ts";
import {TokenContext} from "../Context.tsx";
import "./Boulders.css"
import {
    Grid, GridItem,
    Heading, Image,
    Separator, AspectRatio,
} from "@chakra-ui/react";
import MenuButton from "../components/MenuButton.tsx";
import AbstractForm from "../components/AbstractForm.tsx";


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
    const [pageToLast, setPageToLast] = useState<boolean>(false)
    const { user } = useContext(TokenContext)
    const [addingBoulder, setAddingBoulder] = useState<boolean>(false)

    useEffect(() => {
        setPage(0)
    }, [placeID, boulderData]);

    useEffect(() => {
        if(boulders && boulderLength > 0 && pageToLast) {
            const lastPage = boulderLength - 1
            if(page !== lastPage) {
                setPage(lastPage)
                setPageToLast(false)
            }
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

    function handleAddSubmit(event: React.FormEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement)
        formData.set("placeID", placeID.toString())
        fetch(`${apiUrl}/boulders/place/add`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + user.access_token,
                //"Content-Type": "application/json"
            },
            body: formData
        })
            .then(_ => {
                setPageToLast(true)
                setAddingBoulder(false)
                refetchBoulders()
            })
            .catch(error => console.error(error))
    }

    function handleEditSubmit(event: React.FormEvent){
        if (!boulders || boulders.length < 1) { return }

        const formData = new FormData(event.target as HTMLFormElement);
        formData.set("placeID", boulders[page].place.toString());
        formData.set("boulderID", boulders[page].id.toString());

        fetch(`${apiUrl}/boulders/place/update`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + user.access_token,
                // Remove Content-Type header to let browser set it for FormData
            },
            body: formData
        })
            .then(_ => refetchBoulders())
            .catch(error => console.error(error))
    }

    function handleDeleteClick() {
        if(!boulders) {
            return
        }
        const boulderID: number = boulders[page].id

        fetch(`${apiUrl}/boulders`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.access_token
                },
                body: JSON.stringify({
                    id: boulderID
                })
            }
        )
            .then(_ => refetchBoulders())
            .then(_ => {
                if(page == 0) {
                    return
                }
                setPage(page - 1)
            })
    }

    const fields = [
        {"label": "Name", "type": "string", "name": "name", "required": true},
        {"label": "Grade", "type": "string", "name": "grade", "required": true},
        {"label": "Image", 
            "type": "image", 
            "name": "image", 
            "required": false, 
            "accept": "image/*",
            enableCropping: true,
            targetWidth: 800,
            targetHeight: 600
        },
    ]

    const menuItems = [
        { value: "add", label: "Add Boulder", "onClick": handleAddBoulderClick },
        { value: "edit", label: "Edit Boulder", "onClick": handleEditSubmit },
        { value: "delete", label: "Delete Boulder", "onClick": handleDeleteClick },
    ]

    function handleAddBoulderClick() {
        setAddingBoulder(true)
    }


    if (isLoading) {
        return <div>Loading boulders...</div>
    }

    if(addingBoulder) {
        return(
            <AbstractForm fields={fields} handleSubmit={handleAddSubmit} />
        )
    }

    return(
        <>
            {boulders && boulderLength > 0 && page < boulderLength ? (
                <Grid templateColumns={"repeat(3, 1fr)"} templateRows="repeat(3, 1fr)">
                    <GridItem rowSpan={1} colSpan={1} flexDir="row" display="flex" justifyContent="space-between" alignItems="center" className="grid-item">
                        <Heading >{boulders[page].name}</Heading>
                        <MenuButton options={menuItems}/>
                    </GridItem>
                    <GridItem colSpan={1} rowSpan={1}>
                        <h3>Test</h3>
                    </GridItem>
                    <GridItem colSpan={1} rowSpan={1} >
                        <p>Page {page + 1} of {boulderLength}</p>
                        <ReusableButton onClick={handlePreviousClick} type="button">Previous Boulder</ReusableButton>
                        <ReusableButton onClick={handleNextClick} type="button">Next Boulder</ReusableButton>
                    </GridItem>
                    <GridItem gridArea="1 / 2 / 4 / 4" rowSpan={3} colSpan={2}>
                        <AspectRatio ratio={16/9} height="100%">
                            <Image className="flex-items" objectFit="cover" src={boulders[page].image}/>
                        </AspectRatio>
                    </GridItem>
                </Grid>
            ) : (
                <p>No boulders</p>
            )}

        </>
    );
}

export default Boulders;