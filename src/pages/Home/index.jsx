import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListIcon from '@mui/icons-material/List';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import LogoutIcon from '@mui/icons-material/Logout';

import { AuthContext } from "../../helpers/AuthProvider";



import {
  Container,
  TitleContent,
  MenuContent,
  GreetingText,
  WelcomeText
} from "./styles";
import CardMenu from "../../components/CardMenu";


function Home() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);


  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Olá, bom dia!";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Olá, boa tarde!";
    } else {
      return "Olá, boa noite!";
    }
  };

  return (
    <Container>

      <TitleContent>
        <GreetingText>{getGreeting()}</GreetingText>
        <WelcomeText>Seja bem-vindo(a) à plataforma SOLAR VINI!</WelcomeText>
      </TitleContent>

      <MenuContent>
        <CardMenu
          icon={
            <AddCircleOutlineIcon sx={{ fontSize: "50px", color: "#ffffff" }} />
          }
          name={"INGRESSAR"}
          backgroundColor="#20C4FF"
          color="#ffffff"
          onClick={() => navigate("/register")}
        />

        <CardMenu
          icon={
            <FindInPageIcon sx={{ fontSize: "50px", color: "#ffffff" }} />
          }
          name={"EDITAR/EXCLUIR"}
          backgroundColor="#F5DB67FF"
          color="#ffffff"
          onClick={() => navigate("/listProjects")}
          />

        <CardMenu
          icon={
            <ListIcon sx={{ fontSize: "50px", color: "#ffffff" }} />
          }
          name={"LOGS"}
          backgroundColor="#EB9C52FF"
          color="#ffffff"
          onClick={() => navigate('/listLogs')}
          />

        <CardMenu
          icon={
            <LogoutIcon sx={{ fontSize: "50px", color: "#ffffff" }} />
          }
          name={"SAIR"}
          backgroundColor="#F13636FF"
          color="#ffffff"
          onClick={ async () => { await auth.signout(); }}
        />
      </MenuContent>

    </Container>
  )
}

export default Home