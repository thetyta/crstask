import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:3333'
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const verificarIdUsuario = async (idUsuario) => {
    try {
        const response = await api.get(`/usuario/${idUsuario}/existe`);
        return response.data.existe; // Retorna true ou false
    } catch (error) {
        console.error('Erro ao verificar ID do usuário:', error);
        return false; // Retorna false se houver erro
    }
};