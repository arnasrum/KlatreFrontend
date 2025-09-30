import React from "react";
import { Listbox, Input, useFilter, useListCollection, Text, Box } from "@chakra-ui/react"

type MyListboxProps = {
    initialItems: Array<{value: number, label: string, description: string | null}>;
    setSelectedPlace: (value: number) => void;
};

function MyListbox({initialItems, setSelectedPlace}: MyListboxProps) {
    const { contains } = useFilter({ sensitivity: "base" })
    const { collection, filter } = useListCollection({
        initialItems: initialItems,
        filter: contains
    })

    if(initialItems.length == 0) return (
        <Text>No places in group</Text>
    )


    return (
        <Listbox.Root
            orientation="vertical"
            collection={collection}
        >
            <Listbox.Label hidden>Select a place</Listbox.Label>
            <Listbox.Input
                as={Input}
                placeholder="Search places"
                onChange={event => filter(event.target.value)}
            ></Listbox.Input>
            <Listbox.Content maxH="md">
                {collection.items.map((placeItem: {value: number, label: string, description: string | null}) =>
                    <Box key={placeItem.value} flex={1}>
                        <Listbox.Item item={placeItem} onClick={() => setSelectedPlace(placeItem.value)}>
                            <Listbox.ItemText>{placeItem.label}</Listbox.ItemText>
                            <Text color="fg.muted" fontSize="xs" mt={1}>{placeItem.description || "No description"}</Text>
                            <Listbox.ItemIndicator/>
                        </Listbox.Item>
                    </Box>
                )}
                <Listbox.Empty>No places in group</Listbox.Empty>
            </Listbox.Content>
        </Listbox.Root>
    )


}

export default MyListbox;

