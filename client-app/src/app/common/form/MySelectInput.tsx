import { useField } from "formik";
import { Form, Label, Select } from "semantic-ui-react"

interface Props{
    placeholder: string;
    name: string;
    options: {text: string, value: string}[];
    label?: string;
}

export default function MyTextInput(props: Props){
    const [field, meta, helpers] = useField(props.name);

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Select
                clearable={true}
                options={props.options}
                value={field.value || null}
                placeholder={props.placeholder}
                onBlur={() => helpers.setTouched(true)}
                onChange={(_, d) => helpers.setValue(d.value)}
            />
            {meta.touched && meta.error ? <Label basic color="red">{meta.error}</Label> : null}
        </Form.Field>
    )
}