import api from "./api";

// 댓글 목록
export async function fetchComments(postId) {
    const res = await api.get(`/api/posts/${postId}/comments`);
    return res.data;
}

// 댓글 작성
export async function createComment(postId, content) {
    const res = await api.post(`/api/posts/${postId}/comments`, { content });
    return res.data;
}

// 댓글 수정
export async function updateComment(postId, commentId, content) {
    const res = await api.put(`/api/posts/${postId}/comments/${commentId}`, { content });
    return res.data;
}

// 댓글 삭제
export async function deleteComment(postId, commentId) {
    const res = await api.delete(`/api/posts/${postId}/comments/${commentId}`);
    return res.data;
}
