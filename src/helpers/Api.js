import axios from "axios";

const BASEAPI = 'http://localhost:3001';
//const BASEAPI = import.meta.env.VITE_REACT_APP_API_URL;
import { auth, db } from "../services/Firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";


import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword } from "firebase/auth";


const Api = {
    login: async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            const userId = response.user.uid;

            // Busca o documento do usuário no Firestore, usando o ID do usuário autenticado
            const userDocRef = doc(db, "Users", userId);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                return {
                    connect: false,
                    user: null,
                    token: '',
                    error: "Erro ao estabelecer conexão ao banco de dados.\nTente novamente mais tarde."
                };
            }
            const userData = userDoc.data();
            const token = await response.user.getIdToken();


            return {
                connect: true,
                user: {
                    ...response.user,
                    ...userData
                },
                token: token,
                error: ''
            };

        } catch (error) {
            console.log("ERROR: ", error);
            let errorMessage = '';

            switch (error.code) {
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                case 'auth/invalid-credential':
                    errorMessage = 'Usuário ou senha inválidos.\n Por favor, verifique as informações e tente novamente.';
                    break;
                case 'auth/invalid-api-key':
                    errorMessage = 'Estamos com um problema técnico no momento. Por favor, tente novamente mais tarde.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'O formato do email informado está inválido. Por favor, verifique e tente novamente.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Não foi possível conectar. Verifique sua conexão com a internet e tente novamente.';
                    break;
                default:
                    errorMessage = 'Algo deu errado. Por favor, tente novamente mais tarde.';
            }

            return {
                connect: false,
                user: null,
                token: '',
                error: errorMessage
            };
        }
    },

    resetPassword: async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return {
                success: true,
                message: `E-mail para redefinir senha enviado para ${email} com sucesso!`
            };
        } catch (error) {
            console.log("ERROR: ", error);
            let errorMessage = '';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Não encontramos um usuário com esse e-mail.';
            } else {
                errorMessage = 'Erro ao enviar e-mail de redefinição. Tente novamente mais tarde.';
            }
            return {
                success: false,
                error: errorMessage
            };
        }
    },

    signUp: async (name, email, dateOfBirth, password) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const userId = response.user.uid;

            const userDocRef = doc(db, "Users", userId);
            await setDoc(userDocRef, {
                name: name,
                email: email,
                birthdate: dateOfBirth,
            });

            const token = await response.user.getIdToken();

            return {
                connect: true,
                user: {
                    uid: userId,
                    name: name,
                    email: email,
                    birthdate: dateOfBirth
                },
                token: token,
                error: '',
                message: "Usuário cadastrado com sucesso."
            };
        } catch (error) {
            console.log("ERROR: ", error);
            let errorMessage = '';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Esse usuário já está cadastrado.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'O formato do e-mail informado está inválido. Por favor, verifique e tente novamente.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'A senha é muito fraca. Por favor, utilize uma senha mais forte.';
                    break;
                default:
                    errorMessage = 'Algo deu errado. Por favor, tente novamente mais tarde.';
            }

            return {
                connect: false,
                user: null,
                token: '',
                error: errorMessage
            };
        }
    },

    registerProject: async (projectData) => {
        try {
            const storageToken = localStorage.getItem('authtoken');
            if (!storageToken) {
                return {
                    success: false,
                    error: 'Autenticação necessária. Por favor, faça login novamente.'
                };
            }

            const response = await axios.post(`${BASEAPI}/registerProject`, projectData, {
                headers: {
                    'Authorization': `Bearer ${storageToken}`
                }
            });

            return {
                success: true,
                message: 'Projeto registrado com sucesso!',
                data: response.data
            };
        } catch (error) {
            console.log("ERROR: ", error);

            let errorMessage = 'Erro ao registrar o projeto. Tente novamente mais tarde.';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    },

    getProjectById: async (id) => {
        try {
            const storageToken = localStorage.getItem('authtoken');
            if (!storageToken) {
                return {
                    success: false,
                    error: 'Autenticação necessária. Por favor, faça login novamente.'
                };
            }

            // O id precisa ser enviado como parte de um objeto no corpo da requisição
            const response = await axios.post(`${BASEAPI}/getProjectById`, { id }, {
                headers: {
                    'Authorization': `Bearer ${storageToken}`
                }
            });

            return {
                success: true,
                message: 'Projeto encontrado com sucesso!',
                data: response.data
            };
        } catch (error) {
            console.log("ERROR: ", error);

            let errorMessage = 'Erro ao localizar o projeto. Tente novamente mais tarde.';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    },


    listUserProjects: async () => {
        try {
            // Verificar se o token de autenticação está presente no localStorage
            const storageToken = localStorage.getItem('authtoken');
            if (!storageToken) {
                return {
                    success: false,
                    error: 'Autenticação necessária. Por favor, faça login novamente.'
                };
            }

            // Realizar a requisição para a API
            const response = await axios.get(`${BASEAPI}/listUserProjects`, {
                headers: {
                    'Authorization': `Bearer ${storageToken}`
                }
            });

            // Se for bem-sucedido, retornar a mensagem e os dados
            return {
                success: true,
                message: 'Pesquisa realizada com sucesso!',
                data: response.data.projects
            };

        } catch (error) {
            console.log("ERROR: ", error);

            // Verificar se o erro foi um problema de autenticação
            if (error.response && error.response.status === 401) {
                // Remover o token do localStorage e redirecionar para a página de login deve ser tratado pelo componente que fizer a chamada
                return {
                    success: false,
                    error: 'Sessão expirada. Por favor, faça login novamente.',
                    status: 401
                };
            }

            // Se for outro tipo de erro, apenas retorna uma mensagem padrão
            let errorMessage = 'Erro ao encontrar os projetos. Tente novamente mais tarde.';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    },

    updateProject: async (projectData) => {
        try {
            const storageToken = localStorage.getItem('authtoken');
            if (!storageToken) {
                return {
                    success: false,
                    error: 'Autenticação necessária. Por favor, faça login novamente.'
                };
            }

            // Realiza a requisição PUT para a API com os dados do projeto
            const response = await axios.put(`${BASEAPI}/updateProject`, projectData, {
                headers: {
                    'Authorization': `Bearer ${storageToken}`
                }
            });

            return {
                success: true,
                message: 'Projeto atualizado com sucesso!',
                data: response.data
            };
        } catch (error) {
            console.log("ERROR: ", error);

            let errorMessage = 'Erro ao atualizar o projeto. Tente novamente mais tarde.';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    },

    deleteProject: async (id) => {
        try {
            const storageToken = localStorage.getItem('authtoken');
            if (!storageToken) {
                return {
                    success: false,
                    error: 'Autenticação necessária. Por favor, faça login novamente.'
                };
            }

            // Realiza a requisição DELETE para a API com o ID do projeto
            const response = await axios.delete(`${BASEAPI}/deleteProject/${id}`, {
                headers: {
                    'Authorization': `Bearer ${storageToken}`
                }
            });

            return {
                success: true,
                message: 'Projeto excluído com sucesso!',
                data: response.data
            };
        } catch (error) {
            console.log("ERROR: ", error);

            let errorMessage = 'Erro ao excluir o projeto. Tente novamente mais tarde.';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    },

    listUserLogs: async () => {
        try {
            // Verificar se o token de autenticação está presente no localStorage
            const storageToken = localStorage.getItem('authtoken');
            if (!storageToken) {
                return {
                    success: false,
                    error: 'Autenticação necessária. Por favor, faça login novamente.'
                };
            }
    
            // Realizar a requisição para a API para listar os logs do usuário
            const response = await axios.get(`${BASEAPI}/listUserLogs`, {
                headers: {
                    'Authorization': `Bearer ${storageToken}`
                }
            });
    
            // Se for bem-sucedido, retornar os dados dos logs
            return {
                success: true,
                message: 'Logs encontrados com sucesso!',
                data: response.data.logs
            };
    
        } catch (error) {
            console.log("ERROR: ", error);
    
            // Verificar se o erro foi um problema de autenticação
            if (error.response && error.response.status === 401) {
                // Remover o token do localStorage e redirecionar para a página de login deve ser tratado pelo componente que fizer a chamada
                return {
                    success: false,
                    error: 'Sessão expirada. Por favor, faça login novamente.',
                    status: 401
                };
            }
    
            // Se for outro tipo de erro, apenas retorna uma mensagem padrão
            let errorMessage = 'Erro ao listar os logs. Tente novamente mais tarde.';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }
    
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    




}

export default () => Api
