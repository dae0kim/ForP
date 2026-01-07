import { Box, Card, CardContent, CardMedia, Stack, Typography, Avatar } from "@mui/material";
import { Link, NavLink } from "react-router";
import { eventList } from "../data/events";
import { useEffect, useState } from "react";
import { getMyPets } from "../api/petsApi";
import PostItemCard from "../components/post/PostItemCard";
import { useQuery } from "@tanstack/react-query";
import { fetchMainLatestPosts } from "../api/postsApi";
import defaultProfile from "../assets/images/defaultImage.png";

function Main() {
    const user = JSON.parse(localStorage.getItem("loginUser"));

    const [pets, setPets] = useState([]);

    // 게시글 데이터
    const { data, isLoading, isError } = useQuery({
        queryKey: ["mainLatestPosts"],
        queryFn: fetchMainLatestPosts,
    });
    const posts = data?.content || [];

    // 반려동물 데이터 로딩 로직
    useEffect(() => {
        const loadPets = async () => {
            try {
                const list = await getMyPets();
                setPets(list || []); // 가져온 데이터를 상태에 저장
            } catch (e) {
                console.error("반려동물 로딩 실패:", e);
            }
        };
        loadPets();
    }, []);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // 프로필 사진
    const getFullProfileImage = (url) => {
        if (!url || url.trim() === "") return defaultProfile; // 기본 이미지 반환
        if (url.startsWith("http")) return url;
        return `${BASE_URL}${url}`;
    };

    // 반려동물 사진
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
                                        image={getFullProfileImage(user.profileImage)}
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
                    <Stack spacing={2} sx={{ mt: 3 }}>
                        <Card component={NavLink} to="/mypage"
                            sx={{
                                p: 3, // 카드 안에 내용 padding
                                textDecoration: "none",
                                borderRadius: 8
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" fontWeight={600}
                                    sx={{
                                        mb: 2,
                                        fontSize: '32px'
                                    }}>내 반려동물</Typography>
                                <Typography sx={{ fontSize: '22px' }}>총 {pets.length}마리</Typography>
                            </Stack>
                            {/* 반려동물 카드 Grid */}
                            <Box sx={{
                                mt: 2,
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 2,
                            }}>
                                {pets.map((pet) => (
                                    <Card
                                        key={pet.petId}
                                        sx={{
                                            borderRadius: 6,
                                            overflow: "hidden",
                                            boxShadow: "0 6px 16px rgba(0,0,0,0.8)",
                                        }}>
                                        <Box
                                            component="img"
                                            src={getPetImageUrl(pet.imageUrl)}
                                            alt={pet.name}
                                            sx={{
                                                width: "100%",
                                                height: 140,
                                                objectFit: "cover",
                                            }}
                                        />
                                        <Box sx={{ p: 2 }}>
                                            <Typography fontWeight={700}>
                                                {pet.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {pet.species} · {pet.breed || "품종 없음"} · {pet.gender}
                                            </Typography>
                                        </Box>
                                    </Card>
                                ))}
                            </Box>
                        </Card>
                    </Stack>
                </Box>
            </Box>
        </Stack>
    );
}

export default Main;