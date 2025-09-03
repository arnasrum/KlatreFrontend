import React, { useState, useEffect, useContext } from 'react'
import DeleteButton from "../components/DeleteButton.tsx";
import type Boulder from "../interfaces/Boulder.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import type {BoulderData} from "../interfaces/BoulderData.ts";
import RouteSends from "./RouteSends.tsx";
import {apiUrl} from "../constants/global.ts";
import {TokenContext} from "../Context.tsx";
import "./Boulders.css"
import MenuButton from "../components/MenuButton.tsx";
import AbstractForm from "../components/AbstractForm.tsx";
import Pagination from "../components/Pagination.tsx";

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
    const [boulderAction, setBoulderAction] = useState<"add" | "edit" | null>(null)
    const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false)

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

    function handleAddSubmit(event: React.FormEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement)
        formData.set("placeID", placeID.toString())
        fetch(`${apiUrl}/boulders/place/add`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + user.access_token,
                //("Content-Type": "application/json"
            },
            body: formData
        })
            .then(_ => {
                setPageToLast(true)
                setBoulderAction(null)
                refetchBoulders()
            })
            .catch(error => console.error(error))
    }

    function handleEditSubmit(event: React.FormEvent){
        event.preventDefault();
        if (!boulders || boulders.length < 1) { return }

        const formData = new FormData(event.target as HTMLFormElement);
        formData.set("placeID", boulders[page].place.toString());
        formData.set("boulderID", boulders[page].id.toString());

        fetch(`${apiUrl}/boulders/place/update`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + user.access_token,
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

    function handleImageClick() {
        setIsImageModalOpen(true)
    }

    function handleCloseImageModal() {
        setIsImageModalOpen(false)
    }

    // Handle ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isImageModalOpen) {
                setIsImageModalOpen(false)
            }
        }

        if (isImageModalOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden' // Prevent body scroll
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [isImageModalOpen])

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
        { value: "edit", label: "Edit Boulder", "onClick": () => setBoulderAction("edit") },
        { value: "delete", label: "Delete Boulder", "onClick": handleDeleteClick, color: "fg.error", "hover": {"bg": "bg.error", "color": "fg.error"} },
    ]

    function handleAddBoulderClick() {
        setBoulderAction("add")
    }

    if (isLoading) {
        return (
            <div className="boulders-loading" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                Loading boulders...
            </div>
        )
    }

    if(boulderAction === "add") {
        return(
            <div className="boulders-container">
                <div className="boulder-header">
                    <h2 className="boulder-title">Add New Boulder</h2>
                </div>
                <AbstractForm 
                    fields={fields} 
                    handleSubmit={handleAddSubmit}
                    footer={
                        <div className="boulder-actions">
                            <button 
                                type="button"
                                className="boulder-action-btn secondary"
                                onClick={() => setBoulderAction(null)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="boulder-action-btn primary"
                            >
                                Add Boulder
                            </button>
                        </div>
                    }
                />
            </div>
        )
    }
    
    if(boulderAction === "edit") {
        return(
            <div className="boulders-container">
                <div className="boulder-header">
                    <h2 className="boulder-title">Edit Boulder</h2>
                </div>
                <AbstractForm 
                    fields={fields} 
                    handleSubmit={handleEditSubmit}
                    footer={
                        <div className="boulder-actions">
                            <button 
                                type="button"
                                className="boulder-action-btn secondary"
                                onClick={() => setBoulderAction(null)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="boulder-action-btn primary"
                            >
                                Update Boulder
                            </button>
                        </div>
                    }
                />
            </div>
        )
    }

    if(!boulders || boulderLength === 0) {
        return (
            <div className="boulders-empty">
                <h3>No Boulders Yet</h3>
                <p>Add your first boulder to start tracking climbs at this location!</p>
                <button 
                    className="boulder-action-btn primary"
                    onClick={() => setBoulderAction("add")}
                >
                    Add First Boulder
                </button>
            </div>
        )
    }

    return(
        <div className="boulders-container">
            {boulders && boulderLength > 0 && page < boulderLength && (
                <>
                    <div className="boulder-header">
                        <div>
                            <h2 className="boulder-title">{boulders[page].name}</h2>
                            <div className="boulder-grade">{boulders[page].grade || 'Ungraded'}</div>
                        </div>
                        <MenuButton options={menuItems}/>
                    </div>

                    <div className="boulder-grid">
                        <div className="boulder-info">
                            <div className="boulder-stats">
                                <h3>Boulder Stats</h3>
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <span className="stat-number">{boulderData?.[page].routeSend?.length || 0}</span>
                                        <span className="stat-label">Sends</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{boulders[page].grade || 'N/A'}</span>
                                        <span className="stat-label">Grade</span>
                                    </div>
                                </div>
                            </div>

                            <div className="route-sends">
                                <div className="route-sends-header">
                                    <h3>Recent Sends</h3>
                                </div>
                                <div className="route-sends-content">
                                    <RouteSends boulderID={boulders[page].id} routeSend={boulderData?.[page].routeSend} />
                                </div>
                            </div>

                            <div className="boulder-pagination">
                                <span className="pagination-info">
                                    Boulder {page + 1} of {boulderLength}
                                </span>
                                <Pagination pageSize={1} count={boulderLength} onPageChange={setPage} page={page}/>
                            </div>
                        </div>

                        <div className="boulder-image-container">
                            {boulders[page].image ? (
                                <>
                                    <img 
                                        className="boulder-image" 
                                        src={boulders[page].image}
                                        alt={boulders[page].name}
                                        onClick={handleImageClick}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <div className="image-overlay">
                                        <h3>{boulders[page].name}</h3>
                                        <p>Grade: {boulders[page].grade || 'Ungraded'}</p>
                                    </div>
                                </>
                            ) : (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    height: '100%',
                                    color: '#9ca3af',
                                    fontSize: '1.1rem'
                                }}>
                                    No image available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fullscreen Image Modal */}
                    {isImageModalOpen && (
                        <div className="fullscreen-image-modal">
                            <div className="fullscreen-image-backdrop" onClick={handleCloseImageModal} />
                            <div className="fullscreen-image-container">
                                <div className="fullscreen-image-header">
                                    <div className="fullscreen-image-info">
                                        <h2>{boulders[page].name}</h2>
                                        <span className="fullscreen-image-grade">
                                            Grade: {boulders[page].grade || 'Ungraded'}
                                        </span>
                                    </div>
                                    <button 
                                        className="fullscreen-image-close"
                                        onClick={handleCloseImageModal}
                                        aria-label="Close fullscreen image"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="fullscreen-image-content">
                                    <img 
                                        src={boulders[page].image}
                                        alt={boulders[page].name}
                                        className="fullscreen-image"
                                    />
                                </div>
                                <div className="fullscreen-image-footer">
                                    <p>Press ESC or click outside to close</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Boulders;