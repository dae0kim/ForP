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

// 프로필 사진 수정
export const updateProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.put("/api/mypage/profile-image", formData);
    return response.data;
};
