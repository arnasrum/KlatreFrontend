import React from "react";
import "./ReusableButton.css";

interface ButtonProps {
    children: React.ReactNode,
    type?: "button" | "submit" | "reset",
    onClick?: () => void,
    className?: string,
    style?: React.CSSProperties,
    disabled?: boolean,
}

const ReusableButton: React.FC<ButtonProps> = (props: ButtonProps) => {

    return (
        <button
            onClick={props.onClick}
            className={`btn ${props.className || ''}`}
            style={props.style}
            disabled={props.disabled}
            type={props.type}
        >
            {props.children}
        </button>
    )
}
export default ReusableButton;