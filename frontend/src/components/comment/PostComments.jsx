import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Typography, Avatar, Button, TextField, Stack } from "@mui/material";
import { fetchComments, createComment, updateComment, deleteComment } from "../../api/commentsApi";

function PostComments({ postId, myId }) {
    const qc = useQueryClient();
    const [commentText, setCommentText] = useState("");
    const [commentError, setCommentError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    // 날짜 포맷팅
    const fmtDate = (v) => {
        if (!v) return "";
        const date = new Date(v);
        if (isNaN(date.getTime())) return "";

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const mi = String(date.getMinutes()).padStart(2, '0');

        return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchComments(postId),
        enabled: !!postId,
    });

    const comments = useMemo(() => {
        const list = Array.isArray(data) ? data : data?.items ?? data?.content ?? [];
        return [...list].sort((a, b) => {
            const at = new Date(a.rgstDate ?? 0).getTime();
            const bt = new Date(b.rgstDate ?? 0).getTime();
            return bt - at;
        });
    }, [data]);

    // Mutation 로직 (동일하여 생략 가능하지만 구조 유지)
    const createMut = useMutation({
        mutationFn: (content) => createComment(postId, content),
        onSuccess: async () => {
            setCommentText("");
            await qc.invalidateQueries({ queryKey: ["comments", postId] });
        },
    });

    const updateMut = useMutation({
        mutationFn: ({ commentId, content }) => updateComment(postId, commentId, content),
        onSuccess: async () => {
            setEditingId(null);
            await qc.invalidateQueries({ queryKey: ["comments", postId] });
        },
    });

    const deleteMut = useMutation({
        mutationFn: (commentId) => deleteComment(postId, commentId),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["comments", postId] });
        },
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

            {/* 입력 폼 (기존과 동일) */}
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
                        variant="contained"
                        type="submit"
                        disabled={createMut.isPending}
                        sx={{
                            bgcolor: "#C2E7FE",
                            color: "#fff",
                            px: 2.5,
                            borderRadius: "12px",
                            height: "40px",
                            fontWeight: 700,
                            boxShadow: "none",
                            minWidth: "64px",
                            flexShrink: 0,
                            whiteSpace: "nowrap",
                            "&:hover": { bgcolor: "#2563eb", boxShadow: "none" }
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

                    // 시간 데이터 추출 (밀리초 단위로 변환하여 비교)
                    const rgstTime = c.rgstDate ? new Date(c.rgstDate).getTime() : 0;
                    const updtTime = c.updtDate ? new Date(c.updtDate).getTime() : 0;

                    // 화면 표시용 포맷팅
                    const rgstDateFmt = fmtDate(c.rgstDate);
                    const updtDateFmt = fmtDate(c.updtDate);

                    // 수정 여부 판단 (1초 이상의 유의미한 차이가 있을 때만 수정으로 간주)
                    const isEdited = updtTime > 0 && rgstTime > 0 && Math.abs(updtTime - rgstTime) > 1000;

                    return (
                        <Stack key={cid} direction="row" spacing={2}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: "#e2e8f0" }} />
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <Box>
                                        {/* 이름 */}
                                        <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "#334155" }}>
                                            {c.author?.nickname ?? "익명"}
                                        </Typography>
                                        {/* 시간 */}
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.2, mb: 0.5 }}>
                                            <Typography sx={{ color: "#94a3b8", fontSize: "12px" }}>
                                                {rgstDateFmt}
                                            </Typography>
                                            {isEdited && (
                                                <Typography sx={{ color: "#3b82f6", fontSize: "12px", fontWeight: 500 }}>
                                                    (수정 {updtDateFmt})
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Box>

                                    {/* 수정/삭제 버튼 */}
                                    {isOwner && !isEditing && (
                                        <Stack direction="row" spacing={0.5}>
                                            <Button size="small" sx={{ color: "#64748b", minWidth: 0, fontSize: "12px" }} onClick={() => { setEditingId(cid); setEditingText(c.content); }}>수정</Button>
                                            <Button size="small" sx={{ color: "#ef4444", minWidth: 0, fontSize: "12px" }} onClick={() => window.confirm("댓글을 삭제할까요?") && deleteMut.mutate(cid)}>삭제</Button>
                                        </Stack>
                                    )}
                                </Box>

                                {/* 댓글 본문 영역 */}
                                {isEditing ? (
                                    <Box sx={{ mt: 1 }}>
                                        <TextField fullWidth size="small" value={editingText} onChange={(e) => setEditingText(e.target.value)} sx={{ mb: 1 }} />
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Button size="small" variant="contained" onClick={() => updateMut.mutate({ commentId: cid, content: editingText })}>저장</Button>
                                            <Button size="small" onClick={() => setEditingId(null)}>취소</Button>
                                        </Stack>
                                    </Box>
                                ) : (
                                    <Typography sx={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, whiteSpace: "pre-wrap", mt: 0.5 }}>
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