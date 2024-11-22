import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ButtonMui } from "../../components/ButtonMui";
import Swal from 'sweetalert2';
import { AuthContext } from "../../helpers/AuthProvider";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import Api from "../../helpers/Api";
import {
    Container,
    TitleContent,
    BoxForm,
    BoxSelect
} from "./styles";
import dadosAneel from "../../services/dados_aneel.json";
import { InputTextField } from "../../components/InputTextField";

import CardSistemaImage from "../../assets/cardSistema.jpg";
import CardInvestimento from "../../assets/cardInvestimento.jpg";
import CardAmbiental from "../../assets/cardAmbiental.jpg";

function EditProject() {
    const { id } = useParams(); // Obtém o ID do projeto a partir da URL
    const navigate = useNavigate();
    const api = Api();
    const auth = useContext(AuthContext);

    // Variáveis do formulário (renomeadas para ficarem iguais ao banco de dados)
    const [nameProject, setNameProject] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [distributor, setDistributor] = useState("");
    const [tariffWithTax, setTariffWithTax] = useState("");
    const [account, setAccount] = useState(0);
    const [isTariffDisabled, setIsTariffDisabled] = useState(true);
    const [powerEachModule, setPowerEachModule] = useState(400);
    const [annualSunHours, setAnnualSunHours] = useState(1800);
    const [areaEachModule, setAreaEachModule] = useState(1.6);
    const [weightEachModule, setWeightEachModule] = useState(25);
    const [averageInstalledkWp, setAverageInstalledkWp] = useState(8000);
    const [isSaving, setIsSaving] = useState(false);

    // Variáveis dos cards (não enviadas ao banco, apenas para visualização)
    const [tamanhoSistema, setTamanhoSistema] = useState(0);
    const [numeroModulos, setNumeroModulos] = useState(0);
    const [producaoAnualEstimada, setProducaoAnualEstimada] = useState(0);
    const [areaNecessaria, setAreaNecessaria] = useState(0);
    const [pesoEstimado, setPesoEstimado] = useState(0);
    const [estimativaInvestimento, setEstimativaInvestimento] = useState(0);
    const [economiaMensal, setEconomiaMensal] = useState(0);
    const [economiaTotalAcumulada, setEconomiaTotalAcumulada] = useState(0);
    const [reducaoCO2, setReducaoCO2] = useState(0);
    const [equivalenteArvoresPlantadas, setEquivalenteArvoresPlantadas] = useState(0);
    const [equivalenteKmRodados, setEquivalenteKmRodados] = useState(0);
    const [tempoRetornoInvestimento, setTempoRetornoInvestimento] = useState(0);

    // Manipular mudança no estado
    const handleStateChange = (e) => {
        setState(e.target.value);
        setCity("");
        setDistributor("");
        setTariffWithTax("");
    };

    // Filtrar cidades com base no estado selecionado
    const cities = state ? dadosAneel[state]?.cidades || [] : [];
    // Filtrar distribuidoras com base no estado selecionado
    const distributors = state ? dadosAneel[state]?.distribuidoras || [] : [];

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProjectData();
    }, []);

    useEffect(() => {
        calculateValues();
    }, [
        powerEachModule,
        annualSunHours,
        areaEachModule,
        weightEachModule,
        averageInstalledkWp,
        tariffWithTax,
        city,
        state,
        distributor,
        account
    ]);

    // Função para carregar os dados do projeto
    const fetchProjectData = async () => {
        try {
            const response = await api.getProjectById(id);
            if (response.success) {
                const project = response.data.project;
                setNameProject(project.nameProject);
                setState(project.state);
                setCity(project.city);
                setDistributor(project.distributor);
                setPowerEachModule(project.powerEachModule);
                setAnnualSunHours(project.annualSunHours);
                setAreaEachModule(project.areaEachModule);
                setWeightEachModule(project.weightEachModule);
                setAverageInstalledkWp(project.averageInstalledkWp);
                setTariffWithTax(project.tariffWithTax || "");
                setAccount(parseFloat(project.account) || 0);
                setIsTariffDisabled(false);
                calculateValues(project);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error("Erro ao carregar projeto: ", error);
            Swal.fire({
                icon: "error",
                title: "Erro ao carregar o projeto. Tente novamente mais tarde.",
                showConfirmButton: true,
            }).then(() => {
                navigate("/listProjects");
            });
        }
    };

    // Função para calcular os valores dos cards
    function calculateValues(project = {}) {
        // Verifica se há valores válidos nos inputs, senão pega dos dados do projeto
        const accountValue = parseFloat(account) || parseFloat(project.account) || 0;
        const annualSunHoursValue = annualSunHours || project.annualSunHours || 1800;
        const powerEachModuleValue = powerEachModule || project.powerEachModule || 400;
        const areaEachModuleValue = areaEachModule || project.areaEachModule || 1.6;
        const weightEachModuleValue = weightEachModule || project.weightEachModule || 25;
        const averageInstalledkWpValue = averageInstalledkWp || project.averageInstalledkWp || 8000;
        const tariffWithTaxValue = tariffWithTax || project.tariffWithTax || 0;
    
        // Calcula os valores
        const tamanhoSistemaCalculado = (accountValue * 12) / annualSunHoursValue;
        setTamanhoSistema(tamanhoSistemaCalculado);
    
        const numeroModulosCalculado = (tamanhoSistemaCalculado * 1000) / powerEachModuleValue;
        setNumeroModulos(numeroModulosCalculado);
    
        const producaoAnualCalculada = tamanhoSistemaCalculado * annualSunHoursValue;
        setProducaoAnualEstimada(producaoAnualCalculada);
    
        const areaNecessariaCalculada = numeroModulosCalculado * areaEachModuleValue;
        setAreaNecessaria(areaNecessariaCalculada);
    
        const pesoEstimadoCalculado = numeroModulosCalculado * weightEachModuleValue;
        setPesoEstimado(pesoEstimadoCalculado);
    
        const investimentoCalculado = tamanhoSistemaCalculado * averageInstalledkWpValue;
        setEstimativaInvestimento(investimentoCalculado);
    
        const economiaMensalCalculada = accountValue * tariffWithTaxValue;
        setEconomiaMensal(economiaMensalCalculada);
    
        const economiaTotalCalculada = economiaMensalCalculada * 360;
        setEconomiaTotalAcumulada(economiaTotalCalculada);
    
        const reducaoCO2Calculada = producaoAnualCalculada * 0.084 * 30;
        setReducaoCO2(reducaoCO2Calculada);
    
        const arvoresCalculadas = reducaoCO2Calculada / 20;
        setEquivalenteArvoresPlantadas(arvoresCalculadas);
    
        const kmRodadosCalculados = producaoAnualCalculada * 6 * 30;
        setEquivalenteKmRodados(kmRodadosCalculados);
    
        const tempoRetornoCalculado = investimentoCalculado / (economiaMensalCalculada * 12);
        setTempoRetornoInvestimento(tempoRetornoCalculado);
    }
    

    // Função de clique do botão SALVAR
    const handleSaveProject = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        try {
            const projectData = {
                id,
                nameProject,
                state,
                city,
                distributor,
                tariffWithTax,
                account: account.toString(),
                powerEachModule,
                annualSunHours,
                areaEachModule,
                weightEachModule,
                averageInstalledkWp,
            };

            const result = await api.updateProject(projectData);
            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "Projeto atualizado com sucesso!",
                    showConfirmButton: false,
                    timer: 3000,
                });
                navigate("/listProjects");
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error("Erro ao salvar projeto: ", error);
            Swal.fire({
                icon: "error",
                title: "Erro ao salvar o projeto. Tente novamente mais tarde.",
                showConfirmButton: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Função de clique do botão EXCLUIR
    const handleDeleteProject = async () => {
        Swal.fire({
            icon: 'warning',
            title: 'Excluir Projeto',
            text: `Deseja realmente excluir o projeto ${nameProject}?`,
            showCancelButton: true,
            confirmButtonText: 'Excluir',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await api.deleteProject(id);
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Projeto excluído com sucesso!',
                            showConfirmButton: false,
                            timer: 3000,
                        });
                        navigate("/listProjects");
                    } else {
                        throw new Error(response.error);
                    }
                } catch (error) {
                    console.error("Erro ao excluir projeto: ", error);
                    Swal.fire({
                        icon: "error",
                        title: "Erro ao excluir o projeto. Tente novamente mais tarde.",
                        showConfirmButton: true,
                    });
                }
            }
        });
    };

    return (
        <Container>
            <TitleContent>
                <h1>EDITAR PROJETO</h1>
            </TitleContent>

            <BoxForm onSubmit={handleSaveProject}>
                {/* Campo de nome do projeto */}
                <BoxSelect>
                    <span>Digite o nome do projeto</span>
                    <InputTextField
                        required
                        label={"Nome"}
                        value={nameProject}
                        setValue={(value) => { setNameProject(value); calculateValues(); }}
                    />
                </BoxSelect>

                {/* Select de Estados */}
                <BoxSelect>
                    <span>Selecione o estado desejado:</span>
                    <FormControl fullWidth required>
                        <InputLabel id="state-select-label">Estado</InputLabel>
                        <Select
                            labelId="state-select-label"
                            id="state-select"
                            value={state}
                            label="Estado"
                            onChange={(e) => { handleStateChange(e); calculateValues(); }}
                        >
                            {Object.keys(dadosAneel).map((estado) => (
                                <MenuItem key={estado} value={estado}>
                                    {estado}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </BoxSelect>

                {/* Select de Cidades */}
                <BoxSelect>
                    <span>Selecione a cidade desejada:</span>
                    <FormControl fullWidth required disabled={!state}>
                        <InputLabel id="city-select-label">Cidade</InputLabel>
                        <Select
                            labelId="city-select-label"
                            id="city-select"
                            value={city}
                            label="Cidade"
                            onChange={(e) => { setCity(e.target.value); calculateValues(); }}
                        >
                            {cities.map((cidade) => (
                                <MenuItem key={cidade} value={cidade}>
                                    {cidade}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </BoxSelect>

                {/* Select de Distribuidoras */}
                <BoxSelect>
                    <span>Selecione a distribuidora desejada:</span>
                    <FormControl fullWidth required disabled={!city}>
                        <InputLabel id="distributor-select-label">Distribuidora</InputLabel>
                        <Select
                            labelId="distributor-select-label"
                            id="distributor-select"
                            value={distributor}
                            label="Distribuidora"
                            onChange={(e) => { setDistributor(e.target.value); calculateValues(); }}
                        >
                            {distributors.map((distribuidora) => (
                                <MenuItem key={distribuidora.Distribuidora} value={distribuidora.Distribuidora}>
                                    {distribuidora.Distribuidora}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </BoxSelect>

                {/* Tarifa com Impostos */}
                <BoxSelect>
                    <span>Digite a tarifa com impostos (R$):</span>
                    <FormControl fullWidth required>
                        <InputLabel htmlFor="outlined-adornment-tariff">Tarifa</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-tariff"
                            type="number"
                            value={tariffWithTax}
                            onChange={(e) => { setTariffWithTax(e.target.value); calculateValues(); }}
                            label="Tarifa"
                            startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                        />
                    </FormControl>
                </BoxSelect>

                {/* Conta Mensal de Energia */}
                <BoxSelect>
                    <span>Digite a conta mensal de energia (kWh):</span>
                    <FormControl fullWidth required>
                        <InputLabel htmlFor="outlined-adornment-account">Conta Mensal</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-account"
                            type="number"
                            value={account}
                            onChange={(e) => { setAccount(e.target.value); calculateValues(); }}
                            label="Conta Mensal"
                            startAdornment={<InputAdornment position="start">kWh</InputAdornment>}
                        />
                    </FormControl>
                </BoxSelect>

                {/* Potência de cada módulo */}
                <BoxSelect>
                    <span>Potência de cada módulo (Wp):</span>
                    <FormControl fullWidth required>
                        <InputLabel htmlFor="outlined-adornment-power">Pot. módulo</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-power"
                            type="number"
                            value={powerEachModule}
                            onChange={(e) => { setPowerEachModule(e.target.value); calculateValues(); }}
                            label="Pot. módulo"
                        />
                    </FormControl>
                </BoxSelect>

                {/* Horas de Sol por Ano */}
                <BoxSelect>
                    <span>Horas de Sol por Ano:</span>
                    <InputTextField
                        required
                        label={"Hrs. sol"}
                        type="number"
                        value={annualSunHours}
                        setValue={(value) => { setAnnualSunHours(value); calculateValues(); }}
                    />
                </BoxSelect>

                {/* Área de cada módulo */}
                <BoxSelect>
                    <span>Área de cada módulo (m²):</span>
                    <FormControl fullWidth required>
                        <InputLabel htmlFor="outlined-adornment-area">Área módulo</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-area"
                            type="number"
                            value={areaEachModule}
                            onChange={(e) => { setAreaEachModule(e.target.value); calculateValues(); }}
                            label="Área módulo"
                            endAdornment={<InputAdornment position="end">m²</InputAdornment>}
                        />
                    </FormControl>
                </BoxSelect>

                {/* Peso de cada módulo */}
                <BoxSelect>
                    <span>Peso de cada módulo (kg):</span>
                    <FormControl fullWidth required>
                        <InputLabel htmlFor="outlined-adornment-weight">Peso módulo</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-weight"
                            type="number"
                            value={weightEachModule}
                            onChange={(e) => { setWeightEachModule(e.target.value); calculateValues(); }}
                            label="Peso módulo"
                            endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                        />
                    </FormControl>
                </BoxSelect>

                {/* Custo médio por kWp instalado */}
                <BoxSelect>
                    <span>Custo médio por kWp instalado (R$):</span>
                    <FormControl fullWidth required>
                        <InputLabel htmlFor="outlined-adornment-cost">Custo médio inst.</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-cost"
                            type="number"
                            value={averageInstalledkWp}
                            onChange={(e) => { setAverageInstalledkWp(e.target.value); calculateValues(); }}
                            label="Custo médio inst."
                            startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                        />
                    </FormControl>
                </BoxSelect>

                <h1>Resultados do Cálculo</h1>

                <Card fullWidth>
                    <CardMedia
                        sx={{ height: 140 }}
                        image={CardSistemaImage}
                        title="Sistema Recomendado"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Sistema Recomendado
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Tamanho do Sistema (kWp): {tamanhoSistema.toFixed(2)} <br />
                            Número de Módulos: {numeroModulos.toFixed(0)} <br />
                            Produção Anual Estimada (kWh): {producaoAnualEstimada.toFixed(2)} <br />
                            Área Necessária (m²): {areaNecessaria.toFixed(2)} <br />
                            Peso Estimado (kg): {pesoEstimado.toFixed(2)}
                        </Typography>
                    </CardContent>
                </Card>

                <Card fullWidth>
                    <CardMedia
                        sx={{ height: 140 }}
                        image={CardAmbiental}
                        title="Impacto Ambiental Positivo"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Impacto Ambiental Positivo
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Redução de CO₂ na atmosfera (kg CO₂): {reducaoCO2.toFixed(2)} <br />
                            Equivalente a Árvores Plantadas: {equivalenteArvoresPlantadas.toFixed(0)} <br />
                            Equivalente a KM rodados de carro elétrico: {equivalenteKmRodados.toFixed(2)}
                        </Typography>
                    </CardContent>
                </Card>

                <Card fullWidth>
                    <CardMedia
                        sx={{ height: 140 }}
                        image={CardInvestimento}
                        title="Investimento Necessário e Retorno"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Investimento Necessário e Retorno
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Estimativa de Investimento (R$): {estimativaInvestimento.toFixed(2)} <br />
                            Economia Mensal (R$): {economiaMensal.toFixed(2)} <br />
                            Economia Total Acumulada em 30 anos (R$): {economiaTotalAcumulada.toFixed(2)} <br />
                            Tempo de Retorno do Investimento (anos): {tempoRetornoInvestimento.toFixed(2)}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Botão SALVAR */}
                <ButtonMui
                    name={"SALVAR"}
                    type="submit"
                    isLoading={isSaving}
                    disabled={isSaving}
                />

                {/* Botão EXCLUIR */}
                <ButtonMui
                    name={"EXCLUIR"}
                    variant="outlined"
                    color="error"
                    onClick={handleDeleteProject}
                />

                {/* Botão CANCELAR */}
                <ButtonMui
                    name={"CANCELAR"}
                    variant="outlined"
                    onClick={() => navigate("/listProjects")}
                />

            </BoxForm>
        </Container>
    );
}

export default EditProject;
