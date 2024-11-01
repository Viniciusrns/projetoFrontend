import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

import { InputTextField } from "../../components/InputTextField";
import {
  Container,
  BoxLogin,
  BoxTop,
  BoxMiddle,
  BoxBottom,
  TitleEnterprise,
  TitlePage
} from "./styles";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("aaaaaaa")
  const [password, setPassword] = useState("bbb")

  useEffect(()=>{
    console.log("email: ", email)
    console.log("password: ", password)
  },[email, password])

  return (
    <Container>

      <BoxLogin>

        <BoxTop> 
          <TitleEnterprise>Empresa</TitleEnterprise>
          <TitlePage>Login</TitlePage>
        </BoxTop>

        <BoxMiddle>
          <InputTextField 
            label={"Email"}
            value={email}
            setValue={setEmail}
          /> 
          <InputTextField 
            label={"Password"}
            value={password}
            type="password"
            setValue={setPassword}
          /> 
        </BoxMiddle>

        <BoxBottom>
          <h1>Bottom</h1>
        </BoxBottom>

      </BoxLogin>

      {/* <button onClick={() => navigate('/')}>Logar</button> */}
    </Container>
  )
}

export default Login
