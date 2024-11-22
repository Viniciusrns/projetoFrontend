import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { ButtonMui } from "../../components/ButtonMui";
import Swal from 'sweetalert2';
import { AuthContext } from "../../helpers/AuthProvider";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import CircularProgress from '@mui/material/CircularProgress';
import CardSistemaImage from "../../assets/cardSistema.jpg";

import {
    Container,
    TitleContent,
    BoxForm,
    BoxSelect
} from "./styles";
import Api from "../../helpers/Api";
import { InputTextField } from "../../components/InputTextField";
import { CardMedia } from "@mui/material";

function ListLogs() {
    const navigate = useNavigate();
    const api = Api();
    const auth = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [listLogs, setListLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]); // Estado para logs filtrados
    const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

    // Função para buscar os logs do usuário autenticado
    const handleSearchLogs = async () => {
        setIsLoading(true);
        try {
            const response = await api.listUserLogs();
            if (response.success) {
                // Se não houver erro, atualizar a lista de logs
                setListLogs(response.data);
                setFilteredLogs(response.data); // Inicializar a lista filtrada com todos os logs
                console.log("setListLogs: ", response.data)
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

    // Função para filtrar os logs pelo termo de busca
    const handleFilterLogs = (term) => {
        setSearchTerm(term);
        if (term) {
            const filtered = listLogs.filter((log) =>
                log.projectName?.toLowerCase().includes(term.toLowerCase()) // Verifica se projectName existe antes de chamar toLowerCase
            );
            setFilteredLogs(filtered);
        } else {
            // Se não houver termo de busca, mostrar todos os logs
            setFilteredLogs(listLogs);
        }
    };

    // Chamar a função para buscar logs quando o componente for montado
    useEffect(() => {
        handleSearchLogs();
    }, []);

    return (
        <Container>
            <TitleContent>
                <h1>LISTA DE LOGS</h1>
            </TitleContent>
            <BoxForm>
                <BoxSelect>
                    <span>Busca por nome</span>
                    <InputTextField
                        label={"Projeto"}
                        value={searchTerm}
                        onChange={(e) => handleFilterLogs(e.target.value)} // Corrigido: Atualizar corretamente o valor ao buscar pelo nome do projeto
                    />
                </BoxSelect>

                <div>
                    {isLoading ? (
                        // Exibe o indicador de carregamento enquanto está buscando os dados
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                            <CircularProgress />
                        </div>
                    ) : (
                        // Renderiza a lista de logs após o carregamento
                        filteredLogs.length > 0 ? (
                            filteredLogs.map((log, index) => (
                                <Card key={index} sx={{ margin: '10px' }}>
                                    <CardMedia
                                        sx={{ height: 140 }}
                                        image={CardSistemaImage} // Substitua por uma imagem adequada ou atributo do projeto, se disponível
                                        title={"Log de Projeto"}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {log.projectName}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {log.action}<br />
                                            Data e Hora:{" "}
                                            {log.timestamp && log.timestamp._seconds
                                                ? new Date(log.timestamp._seconds * 1000).toLocaleString()
                                                : "Data inválida"}
                                            <br />
                                            ID do Projeto: {log.projectId}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography variant="body1" sx={{ marginTop: '20px' }}>
                                Nenhum log encontrado.
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

export default ListLogs;
