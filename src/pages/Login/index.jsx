import { useNavigate } from "react-router-dom"

function Login() {
    const navigate = useNavigate();

  return (
    <div>
    <h1>Estamos no login!</h1>
    <button onClick={() => navigate ('/')}>Logar</button>
    </div>
  )
}

export default Login
