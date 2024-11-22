import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { ButtonMui } from "../../components/ButtonMui";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import dadosAneel from "../../services/dados_aneel.json";
import { InputTextField } from "../../components/InputTextField";
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import CardSistemaImage from "../../assets/cardSistema.jpg";
import CardInvestimento from "../../assets/cardInvestimento.jpg";
import CardAmbiental from "../../assets/cardAmbiental.jpg";
import Swal from 'sweetalert2'
import { AuthContext } from "../../helpers/AuthProvider";




import {
    Container,
    TitleContent,
    BoxForm,
    BoxSelect
} from "./styles";
import Api from "../../helpers/Api";

function Register() {
    const navigate = useNavigate();
    const api = Api();
    const auth = useContext(AuthContext);
    const [nameProject, setNameProject] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [distributor, setDistributor] = useState("");
    const [tariffWithTax, setTariffWithTax] = useState("");
    const [isTariffDisabled, setIsTariffDisabled] = useState(true);
    const [account, setAccount] = useState("");
    const [estimatedCost, setEstimatedCost] = useState("");
    const [powerEachModule, setPowerEachModule] = useState(400);
    const [annualSunHours, setAnnualSunHours] = useState(1800);
    const [areaEachModule, setAreaEachModule] = useState(1.6);
    const [weightEachModule, setWeightEachModule] = useState(25);
    const [averageInstalledkWp, setAverageInstalledkWp] = useState(8000);
    const [isLoading, setIsLoading] = useState(false);
    const [isSecondStep, setIsSecondStep] = useState(false);

    //variaveis cards
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

    const [isSaving, setIsSaving] = useState(false);


    const resetCalculations = () => {
        setTamanhoSistema(0);
        setNumeroModulos(0);
        setProducaoAnualEstimada(0);
        setAreaNecessaria(0);
        setPesoEstimado(0);
        setEstimativaInvestimento(0);
        setEconomiaMensal(0);
        setEconomiaTotalAcumulada(0);
        setReducaoCO2(0);
        setEquivalenteArvoresPlantadas(0);
        setEquivalenteKmRodados(0);
        setTempoRetornoInvestimento(0);
    };

    // Manipular mudança no estado
    const handleStateChange = (e) => {
        setState(e.target.value);
        setCity(""); // Reseta a cidade ao mudar o estado
        setDistributor(""); // Reseta a distribuidora ao mudar o estado
        setTariffWithTax(""); // Reseta a tarifa ao mudar o estado
    };

    // Filtrar cidades com base no estado selecionado
    const cities = state ? dadosAneel[state]?.cidades || [] : [];

    // Filtrar distribuidoras com base no estado selecionado
    const distributors = state ? dadosAneel[state]?.distribuidoras || [] : [];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Atualizar tarifa com base nos selects preenchidos
    useEffect(() => {
        if (state && city && distributor) {
            const selectedDistributor = distributors.find(
                (d) => d.Distribuidora === distributor
            );
            if (selectedDistributor) {
                setTariffWithTax(parseFloat(selectedDistributor.Tarifa).toFixed(2));
                setIsTariffDisabled(false); // Habilita o campo
            }
        } else {
            setTariffWithTax(""); // Reseta o valor da tarifa
            setIsTariffDisabled(true); // Desabilita o campo
        }
    }, [state, city, distributor, distributors]);

    useEffect(() => {
        if (account && tariffWithTax) {
            setEstimatedCost((account / tariffWithTax).toFixed(2));
        } else {
            setEstimatedCost("--,--");
        }
    }, [account, tariffWithTax]);

    // Função de clique do botão CALCULAR
    // Função de clique do botão CALCULAR
    const handleCalculateClick = (event) => {
        event.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            // Tamanho do Sistema (kWp)
            const tamanhoSistemaCalculado = (account * 12) / annualSunHours;
            setTamanhoSistema(tamanhoSistemaCalculado);

            // Número de Módulos
            const numeroModulosCalculado = (tamanhoSistemaCalculado * 1000) / powerEachModule;
            setNumeroModulos(numeroModulosCalculado);

            // Produção Anual Estimada (kWh)
            const producaoAnualCalculada = tamanhoSistemaCalculado * annualSunHours;
            setProducaoAnualEstimada(producaoAnualCalculada);

            // Área Necessária (m²)
            const areaNecessariaCalculada = numeroModulosCalculado * areaEachModule;
            setAreaNecessaria(areaNecessariaCalculada);

            // Peso Estimado (kg)
            const pesoEstimadoCalculado = numeroModulosCalculado * weightEachModule;
            setPesoEstimado(pesoEstimadoCalculado);

            // Estimativa de Investimento
            const investimentoCalculado = tamanhoSistemaCalculado * averageInstalledkWp;
            setEstimativaInvestimento(investimentoCalculado);

            // Economia Mensal (R$)
            const economiaMensalCalculada = account * tariffWithTax;
            setEconomiaMensal(economiaMensalCalculada);

            // Economia Total Acumulada em 30 anos
            const economiaTotalCalculada = economiaMensalCalculada * 360;
            setEconomiaTotalAcumulada(economiaTotalCalculada);

            // Redução de CO₂ na atmosfera (kg CO₂)
            const reducaoCO2Calculada = producaoAnualCalculada * 0.084 * 30;
            setReducaoCO2(reducaoCO2Calculada);

            // Equivalente a Árvores Plantadas
            const arvoresCalculadas = reducaoCO2Calculada / 20;
            setEquivalenteArvoresPlantadas(arvoresCalculadas);

            // Equivalente a KM rodados de carro elétrico
            const kmRodadosCalculados = producaoAnualCalculada * 6 * 30;
            setEquivalenteKmRodados(kmRodadosCalculados);

            // Tempo de Retorno do Investimento (anos)
            const tempoRetornoCalculado = investimentoCalculado / (economiaMensalCalculada * 12);
            setTempoRetornoInvestimento(tempoRetornoCalculado);

            setIsLoading(false);
            setIsSecondStep(true); // Passa para a segunda etapa
        }, 2000);
    };


    // Função de clique do botão CANCELAR
    const handleCancelClick = () => {
        window.scrollTo(0, 0);
        setIsSecondStep(false);
        resetCalculations();
    };

    const handleSaveProject = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        try {
            const projectData = {
                nameProject,
                state,
                city,
                distributor,
                tariffWithTax, // Tarifa que o usuário pode editar
                powerEachModule, // Potência de cada módulo que o usuário pode alterar
                annualSunHours, // Horas de sol por ano
                areaEachModule, // Área de cada módulo
                weightEachModule, // Peso de cada módulo
                averageInstalledkWp, // Custo médio por kWp instalado
                account, // Conta mensal de energia do usuário
            };

            const result = await api.registerProject(projectData);
            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: result.message,
                    showConfirmButton: false,
                    timer: 3000,
                });
                navigate("/");
            } else {
                if (result.error === 'Autenticação necessária. Por favor, faça login novamente.') {
                    auth.signout();
                    Swal.fire({
                        icon: "warning",
                        title: "Sessão expirada. Por favor, faça login novamente.",
                        showConfirmButton: false,
                        timer: 3000,
                    });
                    navigate('/login');
                } else {
                    Swal.fire({
                        icon: "error",
                        title: result.error,
                        showConfirmButton: true,
                    });
                }
                handleCancelClick();
            }
        } catch (error) {
            console.log("error: ", error)
            Swal.fire({
                icon: "error",
                title: "Erro ao registrar o projeto. Tente novamente mais tarde.",
                showConfirmButton: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Container>
            <TitleContent>
                <h1>CALCULAR</h1>
            </TitleContent>

            <BoxForm onSubmit={handleCalculateClick}>

                {/* Campo de nome do projeto */}
                <BoxSelect>
                    <span>Digite o nome do projeto</span>
                    <InputTextField
                        required
                        label={"Nome"}
                        value={nameProject}
                        setValue={setNameProject}
                        disabled={isSecondStep}
                    />
                </BoxSelect>

                {/* Select de Estados */}
                <BoxSelect>
                    <span>Selecione o estado desejado:</span>
                    <FormControl fullWidth required disabled={isSecondStep}>
                        <InputLabel id="state-select-label">Estado</InputLabel>
                        <Select
                            labelId="state-select-label"
                            id="state-select"
                            value={state}
                            label="Estado"
                            onChange={handleStateChange}
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
                    <FormControl fullWidth required disabled={!state || isSecondStep}>
                        <InputLabel id="city-select-label">Cidade</InputLabel>
                        <Select
                            labelId="city-select-label"
                            id="city-select"
                            value={city}
                            label="Cidade"
                            onChange={(e) => setCity(e.target.value)}
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
                    <FormControl fullWidth required disabled={!city || isSecondStep}>
                        <InputLabel id="distributor-select-label">Distribuidora</InputLabel>
                        <Select
                            labelId="distributor-select-label"
                            id="distributor-select"
                            value={distributor}
                            label="Distribuidora"
                            onChange={(e) => setDistributor(e.target.value)}
                        >
                            {distributors.map((distribuidora) => (
                                <MenuItem
                                    key={distribuidora.Distribuidora}
                                    value={distribuidora.Distribuidora}
                                >
                                    {distribuidora.Distribuidora}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </BoxSelect>

                {/* Campo de Tarifa */}
                <BoxSelect>
                    <span>Digite a tarifa desejada:</span>
                    <InputTextField
                        required
                        label={"Tarifa"}
                        type="number"
                        value={tariffWithTax}
                        setValue={setTariffWithTax}
                        disabled={isTariffDisabled || isSecondStep}
                    />
                </BoxSelect>

                {/* Conta Mensal de Energia */}
                <BoxSelect>
                    <span>Digite sua conta mensal de energia:</span>
                    <FormControl fullWidth required disabled={isSecondStep}>
                        <InputLabel htmlFor="outlined-adornment-amount">Conta</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                            type="number"
                            label="Conta"
                            value={account}
                            onChange={e => setAccount(e.target.value)}
                        />
                    </FormControl>
                </BoxSelect>

                {/* Consumo Estimado */}
                <BoxSelect>
                    <span>Consumo estimado:</span>
                    <FormControl fullWidth required disabled>
                        <InputLabel htmlFor="outlined-adornment-amount">Con. estimado</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            endAdornment={<InputAdornment position="end">kWh</InputAdornment>}
                            label="Conta"
                            type="number"
                            value={estimatedCost}
                        />
                    </FormControl>
                </BoxSelect>

                {/* Potência de cada módulo */}
                <BoxSelect>
                    <span>Potência de cada módulo:</span>
                    <FormControl fullWidth required disabled={isSecondStep}>
                        <InputLabel htmlFor="outlined-adornment-amount">Pot. módulo</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            endAdornment={<InputAdornment position="end">Wp</InputAdornment>}
                            label="Pot. módulo"
                            type="number"
                            value={powerEachModule}
                            onChange={e => setPowerEachModule(e.target.value)}
                        />
                    </FormControl>
                </BoxSelect>

                {/* Horas de Sol por Ano */}
                <BoxSelect>
                    <span>Horas de sol por ano:</span>
                    <InputTextField
                        required
                        label={"Hrs. sol"}
                        type="number"
                        value={annualSunHours}
                        setValue={setAnnualSunHours}
                        disabled={isSecondStep}
                    />
                </BoxSelect>

                {/* Área de cada módulo (m²) */}
                <BoxSelect>
                    <span>Área de cada módulo (m²):</span>
                    <FormControl fullWidth required disabled={isSecondStep}>
                        <InputLabel htmlFor="outlined-adornment-amount">Área módulo</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            endAdornment={<InputAdornment position="end">m²</InputAdornment>}
                            label="Área módulo"
                            type="number"
                            value={areaEachModule}
                            onChange={e => setAreaEachModule(e.target.value)}
                        />
                    </FormControl>
                </BoxSelect>

                {/* Peso de cada módulo */}
                <BoxSelect>
                    <span>Peso de cada módulo:</span>
                    <FormControl fullWidth required disabled={isSecondStep}>
                        <InputLabel htmlFor="outlined-adornment-amount">Peso módulo</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                            label="Peso módulo"
                            type="number"
                            value={weightEachModule}
                            onChange={e => setWeightEachModule(e.target.value)}
                        />
                    </FormControl>
                </BoxSelect>

                {/* Custo médio por kWp instalado */}
                <BoxSelect>
                    <span>Custo médio por kWp instalado (R$):</span>
                    <FormControl fullWidth required disabled={isSecondStep}>
                        <InputLabel htmlFor="outlined-adornment-amount">Custo médio inst.</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                            label="Custo médio inst."
                            type="number"
                            value={averageInstalledkWp}
                            onChange={e => setAverageInstalledkWp(e.target.value)}
                        />
                    </FormControl>
                </BoxSelect>

                {/* Botão CALCULAR */}
                <ButtonMui
                    name={"CALCULAR"}
                    type="submit"
                    isLoading={isLoading}
                    disabled={isSecondStep}
                />
                {!isSecondStep &&
                    <ButtonMui
                        name={"CANCELAR"}
                        variant="outlined"
                        onClick={() => navigate("/")}
                    />
                }
            </BoxForm>

            {isSecondStep && (
                <BoxForm onSubmit={handleSaveProject}>
                    <h1>Resultados</h1>

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

                    <ButtonMui
                        name={"SALVAR"}
                        type="submit"
                        isLoading={isSaving}
                        disabled={isSaving}
                    />
                    <ButtonMui
                        name={"CANCELAR"}
                        variant="outlined"
                        onClick={handleCancelClick}
                    />
                </BoxForm>
            )}

        </Container>
    );
}

export default Register;
