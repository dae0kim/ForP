import { Box, Card, CardContent, CardMedia, Stack, Typography, Avatar } from "@mui/material";
import { Link, NavLink } from "react-router";
import { eventList } from "../data/events";
import PostItemCard from "../components/post/PostItemCard";
import { useQuery } from "@tanstack/react-query";
import { fetchMainLatestPosts } from "../api/postsApi";

function Main() {
    const user = JSON.parse(localStorage.getItem("loginUser"));

    // 게시글 데이터
    const { data, isLoading, isError } = useQuery({
        queryKey: ["mainLatestPosts"],
        queryFn: fetchMainLatestPosts,
    });
    const posts = data?.content || [];

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const getPetImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("blob:")) return path;
        return `${BASE_URL}${path}`;
    };

    return (
        <Stack direction="row" justifyContent="center">
            {/*================================ Left Area ========================================= */}
            <Box sx={{ flex: 1 }}>
                {/* ------------------------ 이벤트 ------------------------- */}
                <Box>
                    <Typography variant="h6" component='h1' fontWeight={600}
                        sx={{ mb: 2, fontSize: '32px' }}>이벤트</Typography>
                    {/* Event cards */}
                    <Stack
                        direction='row' // 가로 배치
                        spacing={2}
                        sx={{
                            overflowX: 'auto', // 가로 스크롤 활성화
                            pb: 1 // padding-bottom
                        }}>
                        {eventList.map((event) => (
                            <Card
                                key={event.id}
                                component={Link}
                                to={`/events/${event.id}`}
                                sx={{
                                    minWidth: 200,
                                    textDecoration: "none",
                                    borderRadius: 8
                                }}>
                                <CardMedia component="img"
                                    height="120"
                                    image={event.image}
                                    sx={{ objectFit: 'contain' }}
                                />
                                <CardContent sx={{ p: 1.5 }}>
                                    <Typography fontWeight={600} sx={{ pb: 1.5 }}>
                                        {event.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {event.subTitle}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </Box>
                {/* ------------------------ 자유 게시판 ------------------------- */}
                <Box>
                    <Typography variant="h6" sx={{ mb: 2, mt: 4, fontSize: '32px', fontWeight: 600 }}>
                        자유 게시판
                    </Typography>
                    <Stack direction="column" spacing={2} sx={{ pb: 2 }}>
                        {isLoading ? (
                            <Typography sx={{ p: 2 }}>게시글을 불러오는 중입니다...</Typography>
                        ) : isError ? (
                            <Typography sx={{ p: 2, color: 'error.main' }}>게시글 로딩에 실패했습니다.</Typography>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <PostItemCard key={post.id} post={post} />
                            ))
                        ) : (
                            <Typography sx={{ p: 2 }}>등록된 게시글이 없습니다.</Typography>
                        )}
                    </Stack>
                </Box>
            </Box>
            {/*================================ Right Area ========================================= */}
            <Box sx={{
                pl: 4,
                width: 440,
                flexShrink: 0, // 수축 지수 0으로 설정하여 화면이 좁아져도 무조건 width 너비 유지
            }}>
                {/* 마이페이지 영역*/}
                <Box sx={{ backgroundColor: '#F7F8FC', p: 3, borderRadius: 8 }}>
                    <Stack spacing={2}>
                        <Card
                            component={NavLink}
                            to="/mypage"
                            sx={{
                                p: 3, // 카드 안에 내용 padding
                                textDecoration: "none",
                                borderRadius: 8
                            }}>
                            <Typography variant="h6" component='h1' fontWeight={600} sx={{ mb: 2, fontSize: '32px' }}>마이페이지</Typography>
                            {user && (
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <CardMedia
                                        component="img"
                                        image={getPetImageUrl(user.profileImage)}
                                        sx={{
                                            width: 76,
                                            height: 76,
                                            borderRadius: '100%',
                                            objectFit: 'cover',

                                        }} />
                                    <Typography fontWeight={500} sx={{ fontSize: '22px' }}>{user.nickname}</Typography>
                                </Stack>)}
                        </Card>
                    </Stack>
                    {/* 내 반려동물 영역 */}
                    <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography
                            component={NavLink}
                            to="/mypage"
                            variant="h6" fontWeight={600}
                            sx={{
                                mb: 2,
                                fontSize: '32px',
                                textDecoration: "none"
                            }}>내 반려동물</Typography>
                    </Stack>
                </Box>
            </Box>
        </Stack>
    );
}

export default Main;