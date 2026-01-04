import { Box, Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { Link } from "react-router";

function Main(props) {
    const user = JSON.parse(localStorage.getItem("loginUser"));

    // =============== eventList ================
    const eventList = [
        {
            id: 1,
            title: "나와 닮은 반려동물",
            subTitle: "MBTI별 나와 닮은 반려동물 찾기",
            image: "/images/event1.png"
        },
        {
            id: 2,
            title: "이 이벤트가 보이시나요 ?",
            subTitle: "수상한 노트를 보면 주우실 건가요",
            image: "/images/event1.png"
        },
        {
            id: 3,
            title: "이벤트 제목",
            subTitle: "이벤트 부제",
            image: "/images/event1.png"
        },
        {
            id: 4,
            title: "이벤트 제목",
            subTitle: "이벤트 부제",
            image: "/images/event1.png"
        }
    ]

    return (
        <>
        {user && (
                <>
                    <p>환영합니다, {user.nickname} 님 👋</p>
                </>
            )}
        <Box>
            <Typography variant="h6" component='h1' fontWeight={600} 
            sx={{ mb:2, fontSize: '32px'}}>이벤트</Typography>
            
            {/*------------- Event cards ---------------*/}
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
                    }}
                    >
                        {/* img 업로드가 안됨 */}
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
         {/* ------------------------ 자유 게시판 cards ------------------------- */}
         

        </>
    );
}

export default Main;