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

    // ================== boardList ======================
    const boardList = [
        {
            id: 1,
            title: "반려동물 콘테스트에 나가는 사람",
            content: "지금 우리 강아지 나가려고 준비 중인데 그냥 갑자기 자랑하고 싶었음. 엄청 길게 써서 이게 말줄임이 적용이 되는지 확인을 해봐야 함 또 뭘 써야 하는 걸까 난 잘 모르겠지만 잠이 온다 하하하하 갈까 안자고 해야 할 거 같은데 ㅎㅎㅎ",
            image:"/images/event1.png",
            // 아래 3개는 useState로 관리 예정
            commentCnt: 10,
            viewCnt:10,
            date:"2024.11.03"
        },
        {
            id: 2,
            title: "반려동물 콘테스트에 나가는 사람",
            content: "지금 우리 강아지 나가려고 준비 중인데 그냥 갑자기 자랑하고 싶었음. 엄청 길게 써서 이게 말줄임이 적용이 되는지 확인을 해봐야 함 또 뭘 써야 하는 걸까 난 잘 모르겠지만 잠이 온다 하하하하 갈까 안자고 해야 할 거 같은데 ㅎㅎㅎ",
            image:"/images/event1.png",
            // 아래 3개는 useState로 관리 예정
            commentCnt: 10,
            viewCnt:10,
            date:"2025.11.03"
        },
        {
            id: 3,
            title: "반려동물 콘테스트에 나가는 사람",
            content: "지금 우리 강아지 나가려고 준비 중인데 그냥 갑자기 자랑하고 싶었음. 엄청 길게 써서 이게 말줄임이 적용이 되는지 확인을 해봐야 함 또 뭘 써야 하는 걸까 난 잘 모르겠지만 잠이 온다 하하하하 갈까 안자고 해야 할 거 같은데 ㅎㅎㅎ",
            image:"/images/event1.png",
            // 아래 3개는 useState로 관리 예정
            commentCnt: 10,
            viewCnt:10,
            date:"2025.11.03"
        },
        {
            id: 4,
            title: "반려동물 콘테스트에 나가는 사람",
            content: "지금 우리 강아지 나가려고 준비 중인데 그냥 갑자기 자랑하고 싶었음. 엄청 길게 써서 이게 말줄임이 적용이 되는지 확인을 해봐야 함 또 뭘 써야 하는 걸까 난 잘 모르겠지만 잠이 온다 하하하하 갈까 안자고 해야 할 거 같은데 ㅎㅎㅎ",
            image:"/images/event1.png",
            // 아래 3개는 useState로 관리 예정
            commentCnt: 10,
            viewCnt:10,
            date:"2026.01.03"
        }
    ]

    return (
        <>
        {/* 마이페이지 영역에 넣을 예정 */}
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
                    }}
                    >{post.content}
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
         

        </>
    );
}

export default Main;