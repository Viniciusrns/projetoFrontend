import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';


export function ButtonMui({ name, variant = "contained", isLoading, ...rest }) {

    return (
        <Button
            id={name}
            variant={variant}
            style={{
                padding: "15px"
            }}
            {...rest}
        >
            {isLoading ? (
                <CircularProgress size={24} color="inherit" />
            ) : (
                name
            )}
        </Button>
    );
}
