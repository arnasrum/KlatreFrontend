import React, {FormEvent, useEffect, useState} from "react";
import {
    Container,
    Separator,
    VStack
} from "@chakra-ui/react";
import Place from "../../interfaces/Place.ts";
import useSession from "../../hooks/useSession.tsx"
import {RouteAttemptDisplay} from "../../interfaces/RouteAttempt.ts";
import {useBouldersAll} from "../../hooks/useBouldersHooks.ts"
import {usePlaceHooks} from "../../hooks/usePlaceHooks.tsx";
import {usePastSessions} from "../../hooks/usePastSessions.tsx"
import {toaster, Toaster} from "../../components/ui/toaster.tsx";

import {
    SessionHeader,
    SessionStatusCard,
    SessionDetails,
    PastSessions
} from "./components";

import {
    NewSessionModal,
    LogClimbModal,
    EditClimbModal,
    CloseSessionModal
} from "./components/modals";

interface SessionProps{
    groupId: number
}

function Sessions({groupId}: SessionProps): React.ReactElement {

    const [newSessionModalOpen, setNewSessionModalOpen] = useState(false)
    const [logClimbModalOpen, setLogClimbModalOpen] = useState(false)
    const [editClimbModalOpen, setEditClimbModalOpen] = useState(false)
    const [closeSessionModalOpen, setCloseSessionModalOpen] = useState(false)
    const [selectFieldPlaceValue, setSelectFieldPlaceValue] = useState<string[]>([])
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
    const [editingAttempt, setEditingAttempt] = useState<RouteAttemptDisplay | null>(null)
    const { places } = usePlaceHooks({groupId: groupId, autoload: true})

    const {
        session,
        openSession,
        closeSession,
        routeAttempts,
        addRouteAttempt,
        updateRouteAttempt,
        deleteRouteAttempt,
        error,
        clearError,
    } = useSession( {groupId: groupId, placeId: selectedPlace?.id ?? null} )


    const placeId = session?.placeId ?? selectedPlace?.id ?? null
    const { pastSessions, isLoadingPastSessions, refetchPastSession } = usePastSessions({groupId: groupId, autoLoad: true})
    const { boulders, refetchBoulders } = useBouldersAll({"placeID": placeId, fetchActive: "active", autoFetch:false})

    useEffect(() => {
        if(!placeId) {return }
        refetchBoulders().then()
    }, [selectedPlace, session])

    useEffect(() => {
        if(error) {
            toaster.create({
                title: "Error",
                description: "Failed to open a session",
                type: "error"
            })
            clearError()
        }
    } , [error])

    function handleLogClimbClick() {
        setLogClimbModalOpen(true)
    }

    function startNewSessionClick() {
        if(session) {
            toaster.create({
                title: "Error",
                description: "You already have an active session for this group",
                type: "error"
            })
            return
        }
        setNewSessionModalOpen(true)
    }

    function handleSessionStartClick() {
        if(selectFieldPlaceValue.length < 1) {
            toaster.create({
                title: "Error",
                description: "Please select a place to climb",
                type: "error"
            })
            return
        }
        const placeId = parseInt(selectFieldPlaceValue[0])
        const place = places.filter(place => place.id === placeId)[0]
        if(!place) {
            toaster.create({
                title: "Error",
                description: "Place not found",
                type: "error"
            })
            return
        }
        openSession(place.id)
        setNewSessionModalOpen(false)
    }

    function handleCloseSessionClick() {
        if(!session) {
            toaster.create({
                title: "Error",
                description: "You must start a session before closing it",
                type: "error"
            })
            return
        }
        setCloseSessionModalOpen(true)
    }

    async function handleSaveAndCloseSession(save: boolean) {
        if(!session) {
            return
        }
        closeSession(session.id, save)
        setTimeout(() => {
            refetchPastSession()
        }, 100)
        setCloseSessionModalOpen(false)
    }

    function handleDeleteSession() {
        if(!session) {
            return
        }
        setSelectedPlace(null)
        console.log("Deleting session", session)
        closeSession(session.id, false)
        setCloseSessionModalOpen(false)
        toaster.create({
            title: "Session Deleted",
            description: "Session was closed without saving",
            type: "info"
        })
    }

    function saveClimbAttempt(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(!session) {
            toaster.create({
                title: "Error",
                description: "You must start a session before logging a climb",
                type: "error"
            })
            return
        }
        const formData = new FormData(event.currentTarget)
        const routeId = formData.get("route") as string
        const attempts = formData.get("attempts") as string
        if(!routeId || !attempts) {
            toaster.create({
                title: "Error",
                description: "Please fill in all fields",
                type: "error"
            })
            return
        }
        const completed = formData.get("completed") == "on"
        addRouteAttempt({
            routeId: parseInt(routeId),
            attempts: parseInt(attempts),
            completed: completed,
            timestamp: (Math.floor(Date.now() / 1000)).toString()
        })
            .then(() => {
                toaster.create({
                    title: completed ? "Send!" : "Attempt Logged",
                    description: completed ? "Great job crushing that route!" : "Keep pushing!",
                    type: "success"
                })

            })
            .catch(err => {
                console.log(err)
                toaster.create({
                    title: "Error",
                    description: "Failed to log climb attempt",
                    type: "error"
                })
            })
        setLogClimbModalOpen(false)
    }

    function handleEditAttemptClick(attempt: RouteAttemptDisplay) {
        setEditingAttempt(attempt)
        setEditClimbModalOpen(true)
    }

    function saveEditedClimbAttempt(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(!editingAttempt || !session) {
            toaster.create({
                title: "Error",
                description: "Invalid attempt data",
                type: "error"
            })
            return
        }
        const formData = new FormData(event.currentTarget)
        const attempts = formData.get("attempts") as string
        if(!attempts) {
            toaster.create({
                title: "Error",
                description: "Please fill in all fields",
                type: "error"
            })
            return
        }
        const completed = formData.get("completed") == "on"

        updateRouteAttempt({
            ...editingAttempt,
            grade: editingAttempt.gradeName,
            routeId: 0,
            completed: completed,
            attempts: parseInt(attempts),
            timestamp: Date.now() / 1000
        })

        setEditClimbModalOpen(false)
        setEditingAttempt(null)

        toaster.create({
            title: "Success",
            description: "Climb attempt updated",
            type: "success"
        })
    }

    function handleRemoveAttemptClick(attemptId: number) {
        if(!session) {
            toaster.create({
                title: "Error",
                description: "No active session",
                type: "error"
            })
            return
        }
        deleteRouteAttempt(attemptId)
        toaster.create({
            title: "Success",
            description: "Climb attempt removed",
            type: "success"
        })
    }

    const placeFields = places.map((place: Place) => {
        return({label: place.name, value: place.id.toString()})
    })

    const routeFields = boulders.map((boulder) => {
        return({
            label: `${boulder.name}`, 
            value: boulder.id.toString(), 
            description: boulder.description || "No description"
        })
    })
    
    const formFields = [
        {label: "Route", name: "route", type: "select", options: routeFields, placeholder: "Select a route"},
        {label: "Attempts", name: "attempts", type: "number", placeholder: "Enter attempts"},
        {label: "Completed", name: "completed", type: "checkbox"},
    ]

    const editFormFields = editingAttempt ? [
        {
            label: "Attempts", 
            name: "attempts", 
            type: "number", 
            placeholder: "Enter Attempts", 
            defaultValue: editingAttempt.attempts.toString()
        },
        {label: "Completed", name: "completed", type: "checkbox", defaultValue: editingAttempt.completed},
    ] : []

    const currentPlace = session
        ? places.find(place => place.id === placeId) : null;

    function timestampToDate(timestamp: number, mode: "full" | "time"): string {
        const date = new Date(timestamp * 1000)
        if(mode === "full") {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        } else if(mode === "time") {
            const hours = date.getHours()
            const minutes = date.getMinutes()
            return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
        }
        return ""
    }

    return(
        <Container maxW="7xl" py={8}>
            <VStack align="stretch" gap={8}>
                <SessionHeader
                    session={session}
                    onStartNewSession={startNewSessionClick}
                    onCloseSession={handleCloseSessionClick}
                />

                <SessionStatusCard
                    session={session}
                    currentPlace={currentPlace}
                    routeAttempts={routeAttempts}
                    timestampToDate={timestampToDate}
                />

                {session && (
                    <SessionDetails
                        routeAttempts={routeAttempts}
                        onLogClimb={handleLogClimbClick}
                        onEditAttempt={handleEditAttemptClick}
                        onRemoveAttempt={handleRemoveAttemptClick}
                    />
                )}

                <Separator />

                <PastSessions
                    pastSessions={pastSessions}
                    isLoadingPastSessions={isLoadingPastSessions}
                    places={places}
                    session={session}
                    onRefresh={refetchPastSession}
                    onStartNewSession={startNewSessionClick}
                    timestampToDate={timestampToDate}
                />
            </VStack>

            <NewSessionModal
                isOpen={newSessionModalOpen}
                placeValue={selectFieldPlaceValue}
                placeFields={placeFields}
                onSelectChange={setSelectFieldPlaceValue}
                onStart={handleSessionStartClick}
                onClose={() => {
                    setNewSessionModalOpen(false); 
                    setSelectFieldPlaceValue([])
                }}
            />

            <LogClimbModal
                isOpen={logClimbModalOpen}
                formFields={formFields}
                onSubmit={saveClimbAttempt}
                onClose={() => setLogClimbModalOpen(false)}
            />

            <EditClimbModal
                isOpen={editClimbModalOpen}
                editingAttempt={editingAttempt}
                formFields={editFormFields}
                onSubmit={saveEditedClimbAttempt}
                onClose={() => {
                    setEditClimbModalOpen(false)
                    setEditingAttempt(null)
                }}
            />

            <CloseSessionModal
                isOpen={closeSessionModalOpen}
                session={session}
                routeAttempts={routeAttempts}
                onSave={() => handleSaveAndCloseSession(true)}
                onDelete={handleDeleteSession}
                onClose={() => setCloseSessionModalOpen(false)}
            />
            <Toaster/>
        </Container>
    )
}

export default Sessions;
