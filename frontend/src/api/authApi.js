import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

export const kakaoLogin = async (code) => {
    const response = await axios.post(
        `${API_BASE_URL}/auth/login/kakao`,
        null,
        {
            params: { code }
        }
    );
    return response.data; // JWT 문자열
};

export const getMe = async (token) => {
    const response = await axios.get(
        `${API_BASE_URL}/auth/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data; // User 객체
};
