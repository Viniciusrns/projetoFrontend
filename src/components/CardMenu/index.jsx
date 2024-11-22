import {useEffect} from 'react';
import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';

import {
    Container,
} from "./styles";

export default function CardMenu({ name, icon, backgroundColor="ffffff", color, ...rest }) {
    


    return (
        <Card sx={{width:250, height:150}}>
            <CardActionArea {...rest} >
                <Container backgroundColor={backgroundColor} color={color}>
                    {icon}
                    <h1>
                        {name}
                    </h1>
                </Container>
            </CardActionArea>
        </Card>
    );
}