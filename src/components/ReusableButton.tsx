import React from "react";
import { Button } from "@chakra-ui/react";
import "./ReusableButton.css";

interface ButtonProps {
    children: React.ReactNode,
    type?: "button" | "submit" | "reset",
    onClick?: () => void,
    className?: string,
    style?: React.CSSProperties,
    disabled?: boolean,
}

const ReusableButton = (props: ButtonProps) => {

    return (
        <Button
            onClick={props.onClick}
            className={`btn ${props.className || ''}`}
            style={props.style}
            disabled={props.disabled}
            type={props.type}
        >
            {props.children}
        </Button>
    )
}
export default ReusableButton;