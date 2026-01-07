import api from "./api";

// 목록
export async function fetchPosts({ page, size, keyword, mine }) {
    const res = await api.get("/api/posts", { params: { page, size, keyword, mine } });
    return res.data;
}

// 메인화면 게시판 목록 전용
export async function fetchMainLatestPosts() {
    const res = await api.get("/api/posts", { params: { size: 3 } });
    return res.data;
};

// 상세
export async function fetchPostDetail(postId) {
    const res = await api.get(`/api/posts/${postId}`);
    return res.data;
}

// 작성
export async function createPost({ title, content, imageUrls }) {
    const res = await api.post("/api/posts", { title, content, imageUrls });
    return res.data;
}

// 이미지 업로드
export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/api/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
}

// 수정
export async function updatePost(postId, body) {
    const res = await api.put(`/api/posts/${postId}`, body);
    return res.data;
}

// 삭제
export async function deletePost(postId) {
    const res = await api.delete(`/api/posts/${postId}`);
    return res.data;
}
