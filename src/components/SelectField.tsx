import React, {Dispatch, SetStateAction} from 'react';
import { Stack, Text, Box, Select, HStack, Portal, createListCollection} from "@chakra-ui/react"

interface SelectFieldProps {
    fields: Array<{label: string, value: string, description?: string}>,
    value: string[],
    setValue: Dispatch<SetStateAction<string[]>>,
    label?: string,
    placeholder?: string,
    disabled?: boolean
    zIndex?: number,
    width?: string,
    multiple?: boolean
}

function SelectField(props: SelectFieldProps) {

    const fields = createListCollection({
        items: props.fields
    })

    function capitalizeFirstLetter(text: string) {
        if (typeof text !== 'string' || text.length === 0) {
            return text;
        }
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    // Get the display text with proper fallbacks
    const getDisplayText = () => {
        if (props.multiple && props.value.length > 0) {
            const selectedLabels = props.value
                .map(val => fields.items.find(item => item.value === val)?.label)
                .filter(Boolean);
            
            if (selectedLabels.length > 0) {
                return selectedLabels.join(', ');
            }
        }
        
        const foundItem = fields.items.find((item) => item.value === props.value[0]);
        if (foundItem?.label) {
            return foundItem.label;
        }
        return props.placeholder || "Select an option";
    };

    return (
        <Stack width={props.width}>
            <Select.Root key="outline"
                         variant="outline"
                         disabled={props.disabled}
                         collection={fields}
                         value={props.value}
                         onValueChange={(e) => props.setValue(e.value)}
                         width="auto"
                         multiple={props.multiple}
            >
                <Select.HiddenSelect />
                {props.label && <Select.Label>{props.label}</Select.Label>}
                <Select.Control>
                    <Select.Trigger color="fg">
                        {capitalizeFirstLetter(getDisplayText())}
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content zIndex={props.zIndex}>
                            {fields.items.map((item) => (
                                <Select.Item color="fg" item={item} key={item.value}>
                                    {capitalizeFirstLetter(item.label)}
                                    <HStack>
                                        { item.description && (
                                            <Text color="fg.subtle">{item.description}</Text>
                                        )}
                                        <Select.ItemIndicator />
                                    </HStack>
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