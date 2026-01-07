import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Typography, Avatar, Button, TextField, Stack } from "@mui/material";
import { fetchComments, createComment, updateComment, deleteComment } from "../../api/commentsApi";

// 게시판 하단 댓글 영역 컴포넌트
function PostComments({ postId, myId }) {
    const qc = useQueryClient();
    const [commentText, setCommentText] = useState("");
    const [commentError, setCommentError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchComments(postId),
        enabled: !!postId,
    });

    const comments = useMemo(() => {
        const list = Array.isArray(data) ? data : data?.items ?? data?.content ?? [];
        return [...list].sort((a, b) => {
            const at = new Date(a.createdAt ?? a.createdDate ?? 0).getTime();
            const bt = new Date(b.createdAt ?? b.createdDate ?? 0).getTime();
            return bt - at;
        });
    }, [data]);

    const createMut = useMutation({
        mutationFn: (content) => createComment(postId, content),
        onSuccess: async () => {
            setCommentText("");
            await qc.invalidateQueries({ queryKey: ["comments", postId] });
            await qc.invalidateQueries({ queryKey: ["post", postId] });
        },
        onError: () => alert("댓글 등록 실패"),
    });

    const updateMut = useMutation({
        mutationFn: ({ commentId, content }) => updateComment(postId, commentId, content),
        onSuccess: async () => {
            setEditingId(null);
            await qc.invalidateQueries({ queryKey: ["comments", postId] });
        },
        onError: () => alert("댓글 수정 실패"),
    });

    const deleteMut = useMutation({
        mutationFn: (commentId) => deleteComment(postId, commentId),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["comments", postId] });
            await qc.invalidateQueries({ queryKey: ["post", postId] });
        },
        onError: () => alert("댓글 삭제 실패"),
    });

    const onSubmitComment = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return setCommentError("내용을 입력해주세요.");
        createMut.mutate(commentText.trim());
    };

    if (isLoading) return <Typography sx={{ py: 3, textAlign: "center" }}>댓글 로딩 중...</Typography>;
    if (isError) return <Typography sx={{ py: 3, textAlign: "center" }}>댓글을 불러오지 못했습니다.</Typography>;

    return (
        <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "18px", mb: 3 }}>
                댓글 {comments.length}
            </Typography>

            {/* 입력 폼 */}
            <Box component="form" onSubmit={onSubmitComment} sx={{ mb: 5 }}>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                    <TextField
                        fullWidth size="small" placeholder="댓글을 입력하세요"
                        value={commentText}
                        onChange={(e) => { setCommentText(e.target.value); setCommentError(""); }}
                        error={!!commentError} helperText={commentError}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#f8fafc" } }}
                    />
                    <Button
                        variant="contained" type="submit" disabled={createMut.isPending}
                        sx={{
                            bgcolor: "#3b82f6", color: "#fff", px: 3, borderRadius: "12px", height: "40px",
                            fontWeight: 700, minWidth: "fit-content", whiteSpace: "nowrap", boxShadow: "none"
                        }}
                    >
                        등록
                    </Button>
                </Box>
            </Box>

            {/* 댓글 리스트 */}
            <Stack spacing={4}>
                {comments.map((c) => {
                    const cid = c.id ?? c.commentId;
                    const isEditing = editingId === cid;
                    const isOwner = myId != null && Number(myId) === Number(c.author?.id ?? c.memberId);

                    return (
                        <Stack key={cid} direction="row" spacing={2}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: "#e2e8f0" }} />
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: "14px" }}>
                                        {c.author?.nickname ?? "익명"}
                                    </Typography>
                                    {isOwner && !isEditing && (
                                        <Stack direction="row" spacing={0.5}>
                                            <Button size="small" sx={{ color: "#64748b", minWidth: 0 }} onClick={() => { setEditingId(cid); setEditingText(c.content); }}>수정</Button>
                                            <Button size="small" sx={{ color: "#ef4444", minWidth: 0 }} onClick={() => window.confirm("댓글을 삭제할까요?") && deleteMut.mutate(cid)}>삭제</Button>
                                        </Stack>
                                    )}
                                </Box>

                                {isEditing ? (
                                    <Box sx={{ mt: 1 }}>
                                        <TextField fullWidth size="small" value={editingText} onChange={(e) => setEditingText(e.target.value)} sx={{ mb: 1 }} />
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Button size="small" variant="contained" onClick={() => updateMut.mutate({ commentId: cid, content: editingText })}>저장</Button>
                                            <Button size="small" onClick={() => setEditingId(null)}>취소</Button>
                                        </Stack>
                                    </Box>
                                ) : (
                                    <Typography sx={{ fontSize: "14px", color: "#334155", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                                        {c.content}
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    );
                })}
            </Stack>
        </Box>
    );
}

export default PostComments;