import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'


import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';

import Logo from '../../assets/favicon.png';
import { InputTextField } from "../../components/InputTextField";
import { ButtonMui } from "../../components/ButtonMui";

import { AuthContext } from "../../helpers/AuthProvider";

import Api from "../../helpers/Api";

import {
  Container,
  BoxLogin,
  BoxTop,
  BoxMiddle,
  TitlePage,
  LogoImage,
} from "./styles";

function Login() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const api = Api();
  const [email, setEmail] = useState("vrndesa@gmail.com");
  const [password, setPassword] = useState("teste2");
  const [openModal, setOpenModal] = useState(false);
  const [emailForget, setEmailForget] = useState("vrndesa@gmail.com");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    setLoading(true)
    try {
      const json = await auth.signin(email, password);
      if (json.error) {
        Swal.fire({
          icon: "error",
          title: json.error,
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        navigate('/')
      }
    } catch (error) {
      alert("ERROR: ", error)
    } finally {
      setLoading(false)
    }
  };


  const handleSubmitForgetPassword = async (event) => {
    event.preventDefault();
    try {
      const json = await api.resetPassword(emailForget);
      handleClose();
      if (json.error) {
        Swal.fire({
          icon: "error",
          title: json.error,
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: json.message,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      console.log("Error: ", error)
      Swal.fire({
        icon: "error",
        title: "Erro ao se comunicar ao banco de dados.\nTente novamente mais tarde.",
        showConfirmButton: true,
      });
    }
  };


  return (
    <Container>
      <BoxLogin>
        <BoxTop>
          <LogoImage src={Logo} alt="Logo" />
          <TitlePage>Login</TitlePage>
        </BoxTop>

        <BoxMiddle onSubmit={handleSubmitLogin}>
          <InputTextField
            required
            label={"Email"}
            type="email"
            value={email}
            setValue={setEmail}
          />
          <InputTextField
            required
            label={"Password"}
            value={password}
            type="password"
            setValue={setPassword}
          />
          <ButtonMui
            onClick={() => setOpenModal(true)}
            name={"Esqueci minha senha"}
            variant="text"
          />

          <ButtonMui
            name={"ENTRAR"}
            type="submit"
            disabled={loading}
            isLoading={loading}
          />
          <ButtonMui
            name={"CADASTRAR"}
            variant="outlined"
            onClick={() => navigate('/signUp')}
            disabled={loading}
          />
        </BoxMiddle>
      </BoxLogin>

      <Dialog
        onClose={handleClose}
        open={openModal}
      >
        <form onSubmit={handleSubmitForgetPassword} style={{ padding: "10px" }}>
          <DialogTitle>Redefinir Senha</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Se o e-mail informado estiver cadastrado na plataforma, você receberá um link para redefinir sua senha.
              Caso não encontre o e-mail na sua caixa de entrada, verifique também as pastas de spam ou lixeira.
              Se ainda assim não encontrar, é possível que o e-mail não esteja registrado na plataforma.
            </DialogContentText>

            <InputTextField
              margin="dense"
              required
              label={"Email"}
              type="email"
              name="emailForget"
              value={emailForget}
              setValue={setEmailForget}
              sx={{
                width: "350px",
                marginTop: "30px"
              }}
            />
          </DialogContent>

          <DialogActions>
            <ButtonMui
              variant="text"
              onClick={handleClose}
              name={"CANCELAR"}
            />
            <ButtonMui
              variant="outlined"
              type="submit"
              name={"ENVIAR"}
              isLoading={loading}
              disabled={loading}
            />
          </DialogActions>
        </form>
      </Dialog>

    </Container>
  );
}

export default Login;
