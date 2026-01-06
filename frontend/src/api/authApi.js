// src/api/authApi.js
import api from "./api";

// 카카오 로그인
export const kakaoLogin = async (code) => {
    const response = await api.post("/api/auth/login/kakao", null, {
        params: { code },
    });
    return response.data; // JWT 문자열
};

// 내 정보 조회
export const getMe = async (token) => {
    // const response = await axios.get(
    //     `${API_BASE_URL}/auth/me`,
    //     {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     }
    // );
    const response = await api.get("/api/auth/me");
    return response.data; // User 객체
};
