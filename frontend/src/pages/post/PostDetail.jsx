import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Container, Typography, Paper, Divider, CircularProgress, Button } from "@mui/material";

import { fetchPostDetail, deletePost } from "../../api/postsApi";

import "react-quill-new/dist/quill.snow.css";
import PostComments from "../../components/comment/PostComments";
import PostDetailHeader from "../../components/post/PostDetailHeader";
import PostDetailContent from "../../components/post/PostDetailContent";

export default function PostDetail() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const qc = useQueryClient();

    // loginUser(JSON)에서 내 id 읽기
    const myId = useMemo(() => {
        try {
            const raw = localStorage.getItem("loginUser");
            const u = raw ? JSON.parse(raw) : null;
            return u?.id ?? null;
        } catch { return null; }
    }, []);

    // --- API 데이터 호출 ---
    const postQuery = useQuery({
        queryKey: ["post", postId],
        queryFn: () => fetchPostDetail(postId),
        enabled: !!postId,
    });

    const deletePostMut = useMutation({
        mutationFn: () => deletePost(postId),
        onSuccess: async () => {
            alert("삭제되었습니다.");
            await qc.invalidateQueries({ queryKey: ["posts"] });
            navigate("/posts", { replace: true });
        },
        onError: (e) => {
            console.error(e);
            const status = e?.response?.status;
            if (status === 401) return alert("로그인이 필요합니다.");
            if (status === 403) return alert("삭제 권한이 없습니다.");
            alert("삭제 실패");
        },
    });

    // --- 데이터 가공 유틸 ---
    const post = useMemo(() => {
        const d = postQuery.data;
        return d?.data ?? d?.result ?? d ?? null;
    }, [postQuery.data]);

    const fmtDate = (v) => {
        if (!v) return "";
        const date = new Date(v);

        // 날짜가 유효하지 않으면 빈 문자열 반환
        if (isNaN(date.getTime())) return "";

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const mi = String(date.getMinutes()).padStart(2, '0');

        return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
    };

    const postAuthorId = post?.author?.id ?? post?.memberId ?? post?.userId ?? post?.writerId ?? null;
    const isPostOwner = myId != null && postAuthorId != null && Number(myId) === Number(postAuthorId);

    const rgstDate = fmtDate(post?.rgstDate);
    const updtDate = fmtDate(post?.updtDate)
    const isEdited = (updtDate && rgstDate) && updtDate !== rgstDate;

    // --- 핸들러 ---
    const onClickDeletePost = () => {
        if (!isPostOwner) return;
        if (!localStorage.getItem("accessToken")) return alert("로그인이 필요합니다.");
        if (window.confirm("삭제 하시겠습니까?")) deletePostMut.mutate();
    };

    // --- 렌더링 ---
    if (postQuery.isLoading) return <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress /></Box>;
    if (postQuery.isError || !post) {
        return (
            <Container sx={{ py: 10 }}>
                <Typography variant="h5" align="center">게시글을 불러오지 못했습니다.</Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh",py: 5 }}>
            <Container maxWidth="md">
                <Typography sx={{ mb: 4, fontSize: "30px", fontWeight: 600, color: "#1e293b" }}>
                    자유게시판
                </Typography>

                <Paper sx={{ borderRadius: "20px", p: { xs: 3, md: 5 }, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    {/* 헤더 */}
                    <PostDetailHeader
                        post={post}
                        isPostOwner={isPostOwner}
                        onEdit={() => navigate(`/posts/${postId}/edit`)}
                        onDelete={onClickDeletePost}
                        rgstDate={rgstDate}
                        updtDate={updtDate}
                        isEdited={isEdited}
                    />
                    {/* 본문 (Quill Editor) */}
                    <PostDetailContent content={post.content} />
                    <Divider sx={{ mb: 4 }} />
                    {/* 댓글 */}
                    <PostComments postId={postId} myId={myId} />
                    {/* 목록 이동 버튼 */}
                    <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => {
                                navigate("/posts");
                                window.scrollTo(0, 0);
                            }}
                            sx={{
                                px: 4,
                                py: 1,
                                borderRadius: "10px",
                                fontWeight: 700,
                                color: "#64748b",
                                borderColor: "#cbd5e1",
                                "&:hover": {
                                    borderColor: "#94a3b8",
                                    bgcolor: "#f8fafc",
                                },
                            }}
                        >
                            목록으로 돌아가기
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}