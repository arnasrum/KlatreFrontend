interface ButtonProps {
    onClick?: () => void,
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
    disabled?: boolean,
    type?: "button" | "submit" | "reset",
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