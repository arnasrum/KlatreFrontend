import {Button, Menu, MenuItem, Portal} from "@chakra-ui/react";
import React from "react";


interface MenuButtonOption{
    value: string,
    label: string,
    color?: string,
    hover?: object,
    onClick: (event: React.FormEvent) => void
}

interface MenuButtonProps {
    options: Array<MenuButtonOption>
}



function MenuButton(props: MenuButtonProps) {

    const { options } = props

    return(
        <Menu.Root>
            <Menu.Trigger asChild>
                <Button variant="outline" size="sm">
                    Boulder Actions
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content maxH="200px" minW="10rem">
                        {options.map((item: MenuButtonOption)=> (
                            <MenuItem value={item.value}
                                      key={item.value}
                                      onClick={item.onClick}
                                      color={item.color}
                                      _hover={item.hover}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    )

}


export default MenuButton;