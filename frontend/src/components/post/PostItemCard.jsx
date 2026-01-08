// PostItemCard.jsx
import { Box, Card, CardMedia, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import defaultImage from '../../assets/images/defaultImage.png'

function PostItemCard({ post }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const removeHtmlTags = (html) => {
        if (!html) return "";
        const doc = new DOMParser().parseFromString(html, 'text/html');
        let text = doc.body.textContent || "";
        return text.trim().replace(/\s+/g, ' ');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
    };

    // 이미지 경로 처리
    const getImageUrl = (url) => {
        if (!url) return defaultImage;
        if (url.startsWith("http")) return url;

        return `${API_BASE_URL}${url}`;
    };

    return (
        <Card
            component={Link}
            to={`/posts/${post.id}`}
            sx={{
                display: 'flex',
                textDecoration: 'none',
                borderRadius: 8,
                p: 2,
                transition: '0.2s',
                '&:hover': { boxShadow: 3 }
            }}
        >
            {/* 왼쪽 이미지 */}
            <CardMedia
                component="img"
                image={getImageUrl(post.imageUrl)}
                sx={{
                    width: 189,
                    height: 125,
                    borderRadius: 10,
                    objectFit: 'cover',
                    mr: 2
                }}
            />

            {/* 오른쪽 텍스트 영역 */}
            <Box sx={{ flex: 1 }}>
                <Typography fontWeight={600} sx={{ mb: 1, pb: 1, fontSize:'22px', color: '#1f2a37' }}>
                    {post.title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: '40px',
                        fontSize: '20px'
                    }}
                >
                    {removeHtmlTags(post.content)}
                </Typography>

                {/* 하단 메타 정보 */}
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="caption" color="text.secondary" sx={{fontSize: '18px'}}>
                        💬 {post.commentCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{fontSize: '18px'}}>
                        👁 {post.readCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto !important', p:1.5, fontSize: '18px' }}>
                        {formatDate(post.rgstDate)}
                    </Typography>
                </Stack>
            </Box>
        </Card>
    );
}

export default PostItemCard;