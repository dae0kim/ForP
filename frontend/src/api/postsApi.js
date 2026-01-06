import api from "./api";

// 목록
export async function fetchPosts({ page, size, keyword, mine }) {
    const res = await api.get("/posts", { params: { page, size, keyword, mine } });
    return res.data;
}

// 상세
export async function fetchPostDetail(postId) {
    const res = await api.get(`/posts/${postId}`);
    return res.data;
}

// 작성
export async function createPost({ title, content, imageUrl }) {
    const res = await api.post("/posts", { title, content, imageUrl });
    return res.data;
}

// 이미지 업로드
export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/files/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data?.imageUrl ?? res.data;
}

// 수정
export async function updatePost(postId, body) {
    const res = await api.put(`/posts/${postId}`, body);
    return res.data;
}

// 삭제
export async function deletePost(postId) {
    const res = await api.delete(`/posts/${postId}`);
    return res.data;
}
