import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import 'react-quill-new/dist/quill.snow.css';

import { Box, Container } from "@mui/material";

import { createPost } from "../../api/postsApi";
import PostForm from "../../components/post/PostForm";

export default function PostCreate() {
    const navigate = useNavigate();
    const qc = useQueryClient();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrls, setImageUrls] = useState([]);

    // Mutation
    const createMut = useMutation({
        mutationFn: async () => {
            return createPost({ title, content, imageUrls });
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

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 5 }}>
            <Container maxWidth="md">
                {/* 글 작성,수정 컴포넌트 */}
                <PostForm
                    mode="create"
                    title={title} setTitle={setTitle}
                    content={content} setContent={setContent}
                    onSave={() => createMut.mutate()}
                    isPending={createMut.isPending}
                    onCancel={() => navigate(-1)}
                />
            </Container>
        </Box>
    );
}