import React from "react";
import { Button } from "@chakra-ui/react";
import { colorPalettes, sizes, variants} from "../theme/themeUtilities.ts";

interface ButtonProps {
    children: React.ReactNode,
    type?: "button" | "submit" | "reset",
    onClick?: () => void,
    variant?: keyof typeof variants.button,
    colorPalette?: keyof typeof colorPalettes,
    size?: keyof typeof sizes,
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
            variant={variant}
            colorPalette={colorPalette}
            size={size}
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