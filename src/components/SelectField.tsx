import React from 'react';
import { Stack, Select, Portal, createListCollection} from "@chakra-ui/react"

interface SelectFieldProps {
    fields: Array<{label: string, value: string}>,
    value: string[],
    setValue: (val: string[]) => void,
    label?: string,
    placeholder?: string,
    disabled?: boolean
    zIndex?: number,
}

function SelectField(props: SelectFieldProps) {

    const fields = createListCollection({
        items: props.fields
    })



    return (
        <Stack gap="5" width="320px">
            <Select.Root key="outline"
                         variant="outline"
                         disabled={props.disabled}
                         collection={fields}
                         value={props.value}
                         onValueChange={(e) => props.setValue(e.value)}
            >
                <Select.HiddenSelect />
                {props.label && <Select.Label>{props.label}</Select.Label>}
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder={props.placeholder || "Select an option"} />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content zIndex={props.zIndex}>
                            {fields.items.map((item) => (
                                <Select.Item item={item} key={item.value}>
                                    {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
        </Stack>
    )
}

export default SelectField;