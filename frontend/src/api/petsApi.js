import api from "./api";

// 파일 등록
export const uploadPetImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await api.post("/api/files/image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.imageUrl; // "/images/xxx.png"
};

// 반려동물 등록
export const registerPet = async ({ payload, imageFile }) => {
    // 이미지 업로드
    const imageUrl = await uploadPetImage(imageFile);

    // 반려동물 등록 (JSON)
    const res = await api.post("/api/pets", {
        ...payload,
        imageUrl,
    });

    return res.data;
};

// 조회
export const getMyPets = async () => {
    const res = await api.get("/api/pets");
    return res.data;
};

// ID 반려동물 조회
export const getPet = async (petId) => {
    const res = await api.get(`/api/pets/${petId}`);
    return res.data;
};

// 삭제
export const deletePet = async (petId) => {
    await api.delete(`/api/pets/${petId}`);
};

// 수정
export const updatePet = async ({ petId, payload, imageFile }) => {
    let imageUrl = payload.imageUrl; // 기존 유지

    if (imageFile) {
        imageUrl = await uploadPetImage(imageFile);
    }

    const res = await api.put(`/api/pets/${petId}`, { ...payload, imageUrl });
    return res.data;
};
