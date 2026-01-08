import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import 'react-quill-new/dist/quill.snow.css';

import { Box, Container } from "@mui/material";

import { createPost } from "../../api/postsApi";
import PostForm from "../../components/post/PostForm";

function PostCreate() {
    const navigate = useNavigate();
    const qc = useQueryClient();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const createMut = useMutation({
        mutationFn: async (postData) => {
            return createPost(postData);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["posts"] });
            navigate("/posts");
        },
        onError: (e) => {
            console.error(e);
            alert("게시글 등록 실패");
        },
    });

    const handleSave = (urls) => {
        createMut.mutate({
            title,
            content,
            imageUrls: urls
        });
    };

    return (
        <Box sx={{ minHeight: "100vh", py: 5 }}>
            <Container maxWidth="md">
                {/* 글 작성,수정 컴포넌트 */}
                <PostForm
                    mode="create"
                    title={title} setTitle={setTitle}
                    content={content} setContent={setContent}
                    onSave={handleSave}
                    isPending={createMut.isPending}
                    onCancel={() => navigate(-1)}
                />
            </Container>
        </Box>
    );
}

export default PostCreate;