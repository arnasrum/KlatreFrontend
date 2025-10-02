

interface InputField {
    value?: string | string[] | number;
    label: string,
    type: string,
    name: string,
    required?: boolean,
    accept?: string,
    placeholder?: string,
}

export default InputField;