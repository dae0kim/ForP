// src/api/mypageApi.js
import api from "./api";

// 마이페이지 내 정보 조회
export const getMyPageMe = async () => {
    const res = await api.get("/api/mypage/me");
    return res.data;
}

// 닉네임 수정
export const updateNickname = async (nickname) => {
    const res = await api.patch("/api/mypage/nickname", {
        nickname,
    });
    return res.data;
};