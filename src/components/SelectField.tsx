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

    function capitalizeFirstLetter(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

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
                        {capitalizeFirstLetter(fields.items.find((item) => item.value === props.value[0])?.label || props.placeholder || "Select an option")}
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
                                    {capitalizeFirstLetter(item.label)}
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