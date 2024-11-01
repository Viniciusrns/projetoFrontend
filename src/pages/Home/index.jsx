import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Estamos na home!</h1>
      <button onClick={() => navigate('/login')}>Sair</button>
    </div>
  )
}

export default Home
