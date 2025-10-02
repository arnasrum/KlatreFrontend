

export default interface InputField {
    label: string;
    name: string;
    type: string;
    placeholder?: string;
    defaultValue?: string | number;
    options?: Array<{label: string, value: string}>;
    value?: string[];
    disabled?: boolean;
}