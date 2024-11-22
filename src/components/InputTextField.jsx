import TextField from '@mui/material/TextField';


export function InputTextField({ label, type = "text", value, setValue, ...rest }) {

    return (
        <TextField
            id={label}
            variant="outlined"
            label={label}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type={type}
            {...rest}
        />
    );
}
