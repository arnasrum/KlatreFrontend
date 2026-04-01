import React from "react";
import {Button, ConditionalValue} from "@chakra-ui/react";

interface ButtonProps {
    children: React.ReactNode,
    type?: "button" | "submit" | "reset",
    onClick?: () => void,
    variant?: ConditionalValue<"solid" | "outline" | "subtle" | "surface" | "ghost" | "plain">
    colorPalette?: string,
    size?: ConditionalValue<"md" | "sm" | "lg" | "xl" | "2xl" | "2xs" | "xs">,
    width?: "auto" | "full" | string,
    disabled?: boolean,
    loading?: boolean,
    className?: string,
    style?: React.CSSProperties,
}

const ReusableButton = (props: ButtonProps) => {
    const {
        children,
        type = "button",
        onClick,
        variant = "solid",
        colorPalette = "brand",
        size = "md",
        width = "auto",
        disabled = false,
        loading = false,
        className,
        style
    } = props;

    return (
        <Button
            type={type}
            onClick={onClick}
            size={size}
            variant={variant}
            colorPalette={colorPalette}
            width={width}
            disabled={disabled || loading}
            loading={loading}
            className={className}
            style={style}
        >
            {children}
        </Button>
    )
}

export default ReusableButton;