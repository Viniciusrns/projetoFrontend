import { useState, useEffect, createContext } from 'react';
import Api from "./Api";
import { auth } from "../services/Firebase";  // Assumindo que o arquivo Firebase.js exporta auth
import { Navigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('authUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const api = Api();

    // Configurando o listener para renovação do token
    useEffect(() => {
        const unsubscribe = auth.onIdTokenChanged(async (firebaseUser) => {
            if (firebaseUser) {
                // Quando o token do Firebase mudar, pegue um novo token
                const token = await firebaseUser.getIdToken(true);  // 'true' força a renovação do token
                setToken(token);
                setUserData(firebaseUser);
                setUser(firebaseUser);
            } else {
                // Limpe o estado se o usuário não estiver logado
                localStorage.removeItem('authtoken');
                setUser(null);
            }
        });

        // Cleanup da função de listener
        return () => unsubscribe();
    }, []);

    const signin = async (email, password) => {
        const data = await api.login(email, password);
        if (data.connect) {
            setUser(data.user);
            setToken(data.token);
            console.log("USER: ", data.user);
            console.log("TOKEN: ", data.token);
            setUserData(data.user);
            return {
                connect: true,
                error: ''
            };
        } else {
            setUser(null);
            setToken("");
            setUserData("");
            return {
                connect: false,
                error: data.error
            };
        }
    };

    const signout = () => {
        auth.signOut() // Adicionando logout do Firebase para garantir que a sessão seja encerrada no back-end também
            .then(() => {
                setUser(null);
                setToken("");
                setUserData("");
                localStorage.removeItem('authtoken');
            })
            .catch((error) => {
                console.error("Erro ao deslogar:", error);
            });
    };

    const setToken = (token) => {
        localStorage.setItem('authtoken', token);
    };

    const setUserData = (user) => {
        localStorage.setItem('authUser', JSON.stringify(user));
    };

    return (
        <AuthContext.Provider value={{ user, signin, signout }}>
            {children}
        </AuthContext.Provider>
    );
};
