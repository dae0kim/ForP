// src/api/petsApi.js
import api from "./api";

// 반려동물 등록
export const registerPet = async ({ payload, imageFile }) => {
    const fd = new FormData();

    fd.append(
        "data",
        new Blob([JSON.stringify(payload)], {
            type: "application/json",
        })
    );

    fd.append("image", imageFile);

    const res = await api.post("/api/pets", fd, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
};
