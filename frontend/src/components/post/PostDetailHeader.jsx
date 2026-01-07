import { Box, Typography, Stack, Avatar, Button, Divider } from "@mui/material";

// 게시글 상세조회 헤더
function PostDetailHeader({ post, isPostOwner, onEdit, onDelete, rgstDate, updtDate, isEdited }) {
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Typography variant="h4" sx={{ fontSize: "26px", fontWeight: 800, color: "#0f172a" }}>
                    {post.title ?? "(제목 없음)"}
                </Typography>
                {isPostOwner && (
                    <Stack direction="row" spacing={1}>
                        <Button variant="text" sx={{ color: "#64748b" }} onClick={onEdit}>수정</Button>
                        <Button variant="text" sx={{ color: "#ef4444" }} onClick={onDelete}>삭제</Button>
                    </Stack>
                )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 5 }}>
                <Avatar sx={{ width: 45, height: 45, bgcolor: "#cbd5e1" }} />
                <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "15px", color: "#334155" }}>
                        {post.author?.nickname ?? post.writer ?? "익명"}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ color: "#94a3b8", fontSize: "13px" }}>{rgstDate}</Typography>
                        {isEdited && (
                            <Typography sx={{ color: "#3b82f6", fontSize: "13px", fontWeight: 500 }}>
                                (수정 {updtDate})
                            </Typography>
                        )}
                        <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "#cbd5e1" }} />
                        <Typography sx={{ color: "#94a3b8", fontSize: "13px" }}>
                            조회 {Number(post.readCount ?? post.viewCount ?? 0).toLocaleString()}
                        </Typography>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}

export default PostDetailHeader;