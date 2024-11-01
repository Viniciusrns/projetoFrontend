import TextField from '@mui/material/TextField';


export function InputTextField ({label, value, setValue, type="text" }) {

    return (
        <TextField 
            id="outlined-basic" 
            variant="outlined"
            label={label}
            value={value}
            onChange={(e)=>setValue(e.target.value)}
            type={type}
        />
    );
}
