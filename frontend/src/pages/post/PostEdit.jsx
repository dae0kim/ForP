import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Container, Typography, CircularProgress } from "@mui/material";

import PostForm from "../../components/post/PostForm";
import { fetchPostDetail, updatePost } from "../../api/postsApi";

function PostEdit() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const qc = useQueryClient();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // 권한 체크용 사용자 ID
    const myId = useMemo(() => {
        try {
            const raw = localStorage.getItem("loginUser");
            const u = raw ? JSON.parse(raw) : null;
            return u?.id ?? null;
        } catch { return null; }
    }, []);

    // 게시글 상세 데이터
    const { data, isLoading, isError } = useQuery({
        queryKey: ["post", postId],
        queryFn: () => fetchPostDetail(postId),
        enabled: !!postId,
    });

    const post = useMemo(() => data?.data ?? data?.result ?? data ?? null, [data]);

    useEffect(() => {
        if (post) {
            const postAuthorId = post?.author?.id ?? post?.authorId ?? post?.memberId ?? post?.userId ?? null;
            const isOwner = myId != null && postAuthorId != null && Number(myId) === Number(postAuthorId);

            if (!isOwner) {
                alert("본인이 작성한 글만 수정할 수 있습니다.");
                navigate(`/posts/${postId}`, { replace: true });
                return;
            }

            setTitle(post.title ?? "");
            setContent(post.content ?? "");
        }
    }, [post, myId, navigate, postId]);

    const updateMut = useMutation({
        mutationFn: async (postData) => {
            return updatePost(postId, postData);
        },
        onSuccess: () => {
            alert("게시글 수정이 완료되었습니다.");
            qc.invalidateQueries({ queryKey: ["post", postId] });
            qc.invalidateQueries({ queryKey: ["posts"] });
            navigate(`/posts/${postId}`);
        },
        onError: (e) => {
            console.error(e);
            alert("수정 중 오류가 발생했습니다.");
        },
    });

    const handleUpdate = (urls) => {
        updateMut.mutate({
            title,
            content,
            imageUrls: urls
        });
    };

    // 로딩 처리
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    // 에러 처리
    if (isError || !post) {
        return (
            <Container sx={{ py: 10, textAlign: "center" }}>
                <Typography variant="h6" color="textSecondary">게시글을 불러오지 못했습니다.</Typography>
                <Button onClick={() => navigate("/posts")} sx={{ mt: 2 }}>목록으로 돌아가기</Button>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 5 }}>
            <Container maxWidth="md">
                {/* 글 작성,수정 컴포넌트 */}
                <PostForm
                    mode="edit"
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                    onSave={handleUpdate}
                    isPending={updateMut.isPending}
                    onCancel={() => navigate(`/posts/${postId}`)}
                />
            </Container>
        </Box>
    );
}

export default PostEdit;