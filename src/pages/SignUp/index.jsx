import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Swal from 'sweetalert2'

import Api from "../../helpers/Api";
import Logo from "../../assets/favicon.png";
import { InputTextField } from "../../components/InputTextField";
import { ButtonMui } from "../../components/ButtonMui";

import {
  Container,
  BoxLogin,
  BoxTop,
  BoxMiddle,
  TitlePage,
} from "./styles";

function SignUp() {
  const api = Api();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [passwordError, setPasswordError] = useState(""); // Estado para armazenar mensagem de erro da senha
  const [loading, setLoading] = useState(false);

  const handleSubmitSignUp = async (event) => {
    event.preventDefault();

    // Verificar se a senha atende o mínimo de 6 caracteres
    if (password.length < 6) {
      setPasswordError("A senha deve ter no mínimo 6 caracteres.");
      return;
    } else {
      setPasswordError("");
    }

    // Verificar se a senha e a confirmação são iguais
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      return;
    } else {
      setConfirmPasswordError(false);
    }

    try {
      setLoading(true)
      const json = await api.signUp(name, email, dateOfBirth, password);

      if (json.error) {
        Swal.fire({
          icon: "error",
          title: json.error,
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Usuário cadastrado com sucesso!",
          showConfirmButton: false,
          timer: 3000
        });
        setName("")
        setEmail("")
        setDateOfBirth("")
        setPassword("")
        setConfirmPassword("")
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao se conectar ao banco de dados.\nTente novamente mais tarde.",
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setLoading(false)
    }

    console.log("Formulário de signUp enviado:", {
      name,
      email,
      dateOfBirth,
      password,
      confirmPassword,
    });
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
    if (value.length < 6) {
      setPasswordError("A senha deve ter no mínimo 6 caracteres.");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  };

  return (
    <Container>
      <BoxLogin>
        <BoxTop>
          <TitlePage>Inscrever-se</TitlePage>
        </BoxTop>

        <BoxMiddle component="form" onSubmit={handleSubmitSignUp}>
          <InputTextField
            required
            label={"Nome"}
            value={name}
            setValue={setName}
          />
          <InputTextField
            required
            label={"Data de nascimento"}
            value={dateOfBirth}
            type={"date"}
            setValue={setDateOfBirth}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
          <InputTextField
            required
            label={"Email"}
            type="email"
            value={email}
            setValue={setEmail}
          />
          <InputTextField
            required
            label={"Senha"}
            value={password}
            type="password"
            setValue={handlePasswordChange}
            error={Boolean(passwordError)}
            helperText={passwordError}
          />
          <InputTextField
            required
            label={"Confirmar senha"}
            value={confirmPassword}
            type="password"
            setValue={handleConfirmPasswordChange}
            error={confirmPasswordError}
            helperText={
              confirmPasswordError
                ? "As senhas não coincidem. Por favor, verifique."
                : ""
            }
          />

          <Box height={ confirmPasswordError || Boolean(passwordError )  ? 0 : 22} />

          <ButtonMui 
            type="submit" 
            name={"CADASTRAR"}
            disabled = {loading}
            isLoading={loading}
          />
          <ButtonMui
            onClick={() => navigate("/login")}
            name={"CANCELAR"}
            variant="outlined"
            disabled = {loading}
          />
        </BoxMiddle>
      </BoxLogin>
    </Container>
  );
}

export default SignUp;
