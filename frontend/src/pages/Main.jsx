import { Box, Card, CardContent, CardMedia, Stack, Typography, Avatar } from "@mui/material";
import { Link, NavLink } from "react-router";
import { eventList } from "../data/events";
import { useEffect, useState } from "react";
import { getMyPets } from "../api/petsApi";
import eventImg from "../assets/images/event1.png";


function Main() {
    const user = JSON.parse(localStorage.getItem("loginUser"));
    
    const [pets, setPets] = useState([]);

    // 반려동물 데이터 로딩
    useEffect(() => {
        const loadPets = async() =>{
            try{
                const list = await getMyPets();
                setPets(list || []);
            }catch(e){
                console.log(e);
            }
        };
        loadPets();
    }, []);


    // ================== boardList ======================
    const boardList = [
        {
            id: 1,
            title: "반려동물 콘테스트에 나가는 사람",
            content: "지금 우리 강아지 나가려고 준비 중인데 그냥 갑자기 자랑하고 싶었음. 엄청 길게 써서 이게 말줄임이 적용이 되는지 확인을 해봐야 함 또 뭘 써야 하는 걸까 난 잘 모르겠지만 잠이 온다 하하하하 갈까 안자고 해야 할 거 같은데 ㅎㅎㅎ",
            image: eventImg,
            // 아래 3개는 useState로 관리 예정
            commentCnt: 10,
            viewCnt: 10,
            date: "2024.11.03"
        },
        {
            id: 2,
            title: "반려동물 콘테스트에 나가는 사람",
            content: "지금 우리 강아지 나가려고 준비 중인데 그냥 갑자기 자랑하고 싶었음. 엄청 길게 써서 이게 말줄임이 적용이 되는지 확인을 해봐야 함 또 뭘 써야 하는 걸까 난 잘 모르겠지만 잠이 온다 하하하하 갈까 안자고 해야 할 거 같은데 ㅎㅎㅎ",
            image: eventImg,
            // 아래 3개는 useState로 관리 예정
            commentCnt: 10,
            viewCnt: 10,
            date: "2025.11.03"
        },
        {
            id: 3,
            title: "반려동물 콘테스트에 나가는 사람",
            content: "지금 우리 강아지 나가려고 준비 중인데 그냥 갑자기 자랑하고 싶었음. 엄청 길게 써서 이게 말줄임이 적용이 되는지 확인을 해봐야 함 또 뭘 써야 하는 걸까 난 잘 모르겠지만 잠이 온다 하하하하 갈까 안자고 해야 할 거 같은데 ㅎㅎㅎ",
            image: eventImg,
            // 아래 3개는 useState로 관리 예정
            commentCnt: 10,
            viewCnt: 10,
            date: "2025.11.03"
        }
    ]

    return (
        <Stack direction="row" justifyContent="center">
            {/*================================ Left Area ========================================= */}
            <Box sx={{flex: 1}}>
                {/* ------------------------ 이벤트 ------------------------- */}
                <Box>
                    <Typography variant="h6" component='h1' fontWeight={600} 
                    sx={{ mb:2, fontSize: '32px'}}>이벤트</Typography>
                    {/* Event cards */}
                    <Stack 
                    direction='row' // 가로 배치
                    spacing={2}
                    sx={{
                        overflowX: 'auto', // 가로 스크롤 활성화
                        pb:1 // padding-bottom
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
                            sx={{objectFit: 'contain'}}
                            />
                            <CardContent sx={{p: 1.5}}>
                                <Typography fontWeight={600} sx={{pb: 1.5}}>
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
                    <Typography variant="h6" component='h1' fontWeight={600} 
                    sx={{ mb:2, mt:4, fontSize: '32px'}}>자유 게시판</Typography>
                    <Stack 
                    direction="column"
                    spacing={2}
                    sx={{ overflowY: 'auto', // 세로 스크롤 활성화
                    pb:2
                    }}>
                        {boardList.map((post) => (
                        <Card
                        key={post.id}
                        component={Link}
                        to={`/posts/${post.id}`}
                        sx={{
                            display: 'flex',
                            textDecoration: 'none',
                            borderRadius: 8,
                            p: 2
                        }}
                        >
                            {/* 왼쪽 이미지 */}
                            <CardMedia
                            component="img"
                            image={post.image} 
                            sx={{
                                width: 189,
                                height: 125,
                                borderRadius:10,
                                objectFit: 'cover',
                                mr: 2 // margin right             
                            }}/>
                            {/* 오른쪽 텍스트 */}
                            <Box sx={{ flex:1 }}>
                                <Typography fontWeight={600} sx={{ mb:1, pb: 1.5 }}>
                                    {post.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb:1,
                                        overflow: "hidden",
                                        textOverflow:"ellipsis", // 말줄임표
                                        display: "-webkit-box", // 해당 요소를 이전 세대의 플렉스박스 형태로 만듦
                                        WebkitLineClamp: 2, // 텍스트를 최대 몇 줄까지 보여줄지 (2줄 이상 넘어가면 말줄임표 처리)
                                        WebkitBoxOrient: "vertical", // 박스 안의 콘텐츠 정렬 방향을 수직으로 설정
                                    }}>{post.content}
                                </Typography>
                                {/* 아래측 댓글 수, 조회수, 날짜 */}
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignContent="center"
                                >
                                    <Typography variant="caption" color="text.secondary">
                                        💬 {post.commentCnt}
                                    </Typography>                        
                                    <Typography variant="caption" color="text.secondary">
                                        👁 {post.viewCnt}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mr: "auto" }}>
                                        {post.date}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Card>
                        ))}
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
            <Box sx={{backgroundColor: '#F7F8FC', p: 3, borderRadius: 8 }}>
                <Stack spacing={2}>
                    <Card 
                    component={NavLink}
                    to="/mypage"   
                    sx={{p:3, // 카드 안에 내용 padding
                    textDecoration:"none",
                    borderRadius: 8}}>
                    <Typography variant="h6" component='h1'fontWeight={600} sx={{mb:2, fontSize: '32px'}}>마이페이지</Typography>
                    {user && (
                    <Stack direction="row" spacing={2} alignItems="center">
                    <CardMedia
                    component="img"
                    image={user.profileImage || "/images/profile.png"}
                    sx={{
                        width:76,
                        height:76,
                        borderRadius:'100%',
                        objectFit:'cover',
                        }} />
                    <Typography fontWeight={500} sx={{ fontSize: '22px' }}>{user.nickname}</Typography>
                    </Stack>)}
                    </Card>
                </Stack>
                {/* 내 반려동물 영역 */}
                <Stack spacing={2} sx={{ mt:3 }}>
                    <Card component={NavLink} to="/mypage" 
                    sx={{
                        p:3, // 카드 안에 내용 padding
                        textDecoration:"none",
                        borderRadius: 8
                        }}
                    >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={600} 
                        sx={{ mb: 2, 
                        fontSize: '32px' }}>내 반려동물</Typography>
                        <Typography sx={{ fontSize: '22px' }}>총 {pets.length}마리</Typography>
                    </Stack>   
                    {/* 반려동물 카드 Grid */}
                    <Box sx={{
                        mt:2, 
                        display:"grid",
                        gridTemplateColumns:"1fr 1fr",
                        gap:2,
                    }}>
                        {pets.map((pet) =>(
                            <Card 
                            key={pet.petId}
                            sx={{
                                borderRadius:6,
                                overflow:"hidden",
                                boxShadow:"0 6px 16px rgba(0,0,0,0.8)",
                            }}>
                                <Box
                                component="img"
                                src={pet.imageUrl}
                                alt={pet.name}
                                sx={{
                                    width:"100%",
                                    height:140,
                                    objectFit:"cover",
                                }}
                                />
                                <Box sx={{p:2}}>
                                    <Typography fontWeight={700}>
                                        {pet.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                    {pet.species} · {pet.gender}
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