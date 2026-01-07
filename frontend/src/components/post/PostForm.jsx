import { useRef, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Box, Paper, TextField, Button, Stack, Divider, Typography } from "@mui/material";
import { uploadImage } from "../../api/postsApi";

function PostForm({
    mode = "create", // 글 작성이면 create, 수정이면 edit
    title, setTitle,
    content, setContent,
    onSave, isPending, onCancel
}) {
    const quillRef = useRef(null);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["image", "link"],
                ["clean"],
            ],
            handlers: {
                image: function () {
                    const input = document.createElement("input");
                    input.setAttribute("type", "file");
                    input.setAttribute("accept", "image/*");
                    input.click();

                    input.onchange = async () => {
                        const file = input.files[0];
                        if (file) {
                            try {
                                const resUrl = await uploadImage(file);

                                const fullUrl = resUrl.startsWith('http')
                                    ? resUrl
                                    : `${import.meta.env.VITE_API_BASE_URL}${resUrl}`;

                                const editor = quillRef.current.getEditor();
                                const range = editor.getSelection();
                                editor.insertEmbed(range.index, "image", fullUrl);
                            } catch (error) {
                                console.error("이미지 업로드 실패:", error);
                                alert("이미지 업로드 중 오류가 발생했습니다.");
                            }
                        }
                    };
                }
            },
        },
    }), []);

    // 유효성 검사 및 저장 핸들러
    const handleValidateAndSave = () => {
        if (!title.trim()) {
            alert("제목을 입력하세요.");
            return;
        }

        const plainText = content.replace(/<[^>]*>?/gm, '').trim();
        const hasImage = content.includes('<img');

        if (!plainText && !hasImage) {
            alert("내용을 입력하세요.");
            return;
        }

        const extractImageUrls = (html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const imgs = doc.querySelectorAll('img');
            return Array.from(imgs).map(img => img.getAttribute('src'));
        };

        const imageUrls = extractImageUrls(content);

        onSave(imageUrls);
    };

    return (
        <Paper sx={{ borderRadius: "26px", p: { xs: 3, md: 4 }, boxShadow: "0 10px 24px rgba(0, 0, 0, 0.08)", border: "1px solid rgba(0, 0, 0, 0.05)" }}>
            <Typography sx={{ mb: 3, fontSize: "32px", fontWeight: 700, color: "#0f172a" }}>
                {mode === "create" ? "새 글 등록" : "글 수정"}
            </Typography>

            <Stack spacing={2}>
                <TextField
                    fullWidth placeholder="제목을 입력하세요."
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "#fff", "& fieldset": { borderColor: "#cfe8ff" } } }}
                />

                <Box sx={{
                    "& .ql-container": { height: "400px", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", border: "1px solid #cfe8ff !important" },
                    "& .ql-toolbar": { borderTopLeftRadius: "8px", borderTopRightRadius: "8px", border: "1px solid #cfe8ff !important", bgcolor: "#f8fbff" },
                    mb: "20px"
                }}>
                    <ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={modules} placeholder="내용을 입력하세요." />
                </Box>

                <Divider />

                <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 1 }}>
                    <Button variant="contained" 
                    onClick={onCancel} 
                    sx={{ 
                        height: "38px", 
                        px: 3, 
                        borderRadius: "10px", 
                        bgcolor: "#d9e9f7", 
                        color: "#000", 
                        fontWeight: 700, 
                        fontSize:"20px",
                        boxShadow: "none", 
                        "&:hover": { bgcolor: "#cbdff0", boxShadow: "none" } }}
                    >
                        취소
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleValidateAndSave}
                        disabled={isPending}
                        sx={{ height: "38px",
                        px: 3, 
                        borderRadius: "10px", 
                        bgcolor: "#8fc9f0", 
                        color: "#000", 
                        fontSize:"20px",
                        fontWeight: 700, 
                        boxShadow: "none", 
                        "&:hover": { bgcolor: "#7ab8e0", boxShadow: "none" } }}
                    >
                        {isPending ? "처리 중..." : mode === "create" ? "등록" : "수정 완료"}
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}

export default PostForm;