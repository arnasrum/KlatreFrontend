import Boulder from "../interfaces/Boulder.ts";

interface BoulderFormProps {
    handleSubmit: (event: React.FormEvent) => void;
    boulders?: Array<Boulder> | null;
    page?: number;
    defaultValues?: boolean;
}

function BoulderForm({ handleSubmit, boulders, page, defaultValues }: BoulderFormProps) {

    const getDefaultValue = (field: string) => {
        if(!boulders) {
            return '';
        }
        if(field == "name") {
            return defaultValues && boulders?.[page!] ? boulders[page!].name : '';
        }
        if(field == "grade") {
            return defaultValues && boulders?.[page!] ? boulders[page!].grade : '';
        }
        if(field == "description") {
            return defaultValues && boulders?.[page!] ? boulders[page!].description : '';
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input 
                    id="name" 
                    name="name"
                    defaultValue={getDefaultValue('name')}
                    required
                />
            </label>
            <label>
                Grade:
                <input 
                    id="grade" 
                    name="grade"
                    defaultValue={getDefaultValue('grade')}
                />
            </label>
            <label>
                Description:
                <textarea
                    id="description"
                    name="description"
                />
            </label>
            <label>
                Image:
                <input 
                    id="image" 
                    name="image"
                    type="file" 
                    accept="image/*"
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}

export default BoulderForm;