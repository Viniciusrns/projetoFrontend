import { useNavigate } from "react-router-dom";
import { Button, Typography, Container } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center'
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: '80px', color: '#f44336', mb: 2 }} />
      <Typography variant="h3" color="primary" gutterBottom>
        404 - Página Não Encontrada
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Desculpe, a página que você está tentando acessar não existe.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ mt: 3 }}
      >
        Voltar para Home
      </Button>
    </Container>
  );
}

export default NotFound;