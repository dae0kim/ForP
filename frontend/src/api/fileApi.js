import { api } from "./api";

export async function uploadImage(file) {
    // 브라우저에서 바이너리 데이터 전송 시 반드시 formData 사용
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/api/files/image', formData, {
        headers: {
            'content-Type': 'multipart/form-data'
        }
    });

    return res.data;
}