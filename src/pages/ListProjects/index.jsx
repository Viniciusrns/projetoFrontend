import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { ButtonMui } from "../../components/ButtonMui";
import Swal from 'sweetalert2';
import { AuthContext } from "../../helpers/AuthProvider";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import CardSistemaImage from "../../assets/cardSistema.jpg";
import CircularProgress from '@mui/material/CircularProgress';

import {
    Container,
    TitleContent,
    BoxForm,
    BoxSelect
} from "./styles";
import Api from "../../helpers/Api";
import { InputTextField } from "../../components/InputTextField";
import { CardActionArea } from "@mui/material";

function ListProjects() {
    const navigate = useNavigate();
    const api = Api();
    const auth = useContext(AuthContext);

    const [nameProject, setNameProject] = useState("");
    const [listProjects, setListProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]); // Estado para projetos filtrados
    const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

    // Função para buscar os projetos do usuário autenticado
    const handleSearchProjects = async () => {
        setIsLoading(true);
        try {
            const response = await api.listUserProjects();
            if (response.success) {
                // Se não houver erro, atualizar a lista de projetos
                setListProjects(response.data);
                setFilteredProjects(response.data); // Inicializar a lista filtrada com todos os projetos
            } else {
                // Caso haja erro, tratar com Swal
                if (response.error === 'Autenticação necessária. Por favor, faça login novamente.') {
                    auth.signout(); // Deslogar usuário no contexto de autenticação
                    Swal.fire({
                        icon: 'warning',
                        title: response.error,
                        showConfirmButton: true,
                    }).then(() => {
                        navigate('/login'); // Redirecionar para a página de login
                    });
                } else {
                    // Mostrar outra mensagem de erro
                    Swal.fire({
                        icon: 'error',
                        title: response.error,
                        showConfirmButton: true,
                    });
                }
            }
        } catch (error) {
            // Tratar erros não relacionados ao servidor, como problemas de rede
            console.log("Error: ", error);
            Swal.fire({
                icon: 'error',
                title: "Erro ao se conectar ao banco de dados. Tente novamente mais tarde.",
                showConfirmButton: true,
            }).then(() => {
                navigate("/"); // Redirecionar para a página inicial
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Função para filtrar os projetos pelo nome do projeto
    const handleFilterProjects = (searchTerm) => {
        setNameProject(searchTerm);
        if (searchTerm) {
            const filtered = listProjects.filter((project) =>
                project.nameProject.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProjects(filtered);
        } else {
            // Se não houver termo de busca, mostrar todos os projetos
            setFilteredProjects(listProjects);
        }
    };

    // Chamar a função para buscar projetos quando o componente for montado
    useEffect(() => {
        handleSearchProjects();
    }, []);

    return (
        <Container>
            <TitleContent>
                <h1>LISTA DE PROJETOS</h1>
            </TitleContent>
            <BoxForm>
                <BoxSelect>
                    <span>Busca por nome</span>
                    <InputTextField
                        label={"Nome do Projeto"}
                        value={nameProject}
                        setValue={handleFilterProjects} // Atualizar o valor ao buscar pelo nome
                    />
                </BoxSelect>

                <div>
                    {isLoading ? (
                        // Exibe o indicador de carregamento enquanto está buscando os dados
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                            <CircularProgress />
                        </div>
                    ) : (
                        // Renderiza a lista de projetos após o carregamento
                        filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <Card key={project.id} sx={{ margin: '10px' }}>
                                    <CardActionArea onClick={()=>navigate(`/project/${project.id}`)}>
                                        <CardMedia
                                            sx={{ height: 140 }}
                                            image={CardSistemaImage} // Substitua por uma imagem adequada ou atributo do projeto, se disponível
                                            title={project.nameProject}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {project.nameProject}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Estado: {project.state}<br />
                                                Cidade: {project.city}<br />
                                                Distribuidora: {project.distributor}<br />
                                                Potência (Wp): {project.powerEachModule}<br />
                                                Horas de Sol Anuais: {project.annualSunHours}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            ))
                        ) : (
                            <Typography variant="body1" sx={{ marginTop: '20px' }}>
                                Nenhum projeto encontrado.
                            </Typography>
                        )
                    )}
                </div>

                <ButtonMui
                    name={"CANCELAR"}
                    variant="outlined"
                    onClick={() => navigate("/")}
                />
            </BoxForm>
        </Container>
    );
}

export default ListProjects;
