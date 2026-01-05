import { Box, Container, Stack, Button, AppBar, Toolbar, Typography } from '@mui/material';
import { Link, Outlet } from 'react-router';

// 헤더 + 메뉴 + 메인화면 연결
function AppLayout(props) {

    // 로그아웃 이벤트 핸들러
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    }

    return (
        <Box>
            {/* 상단 헤더 */}
            <AppBar position='fixed'>
                <Container maxWidth="xl" sx={{px:10}}>
                    <Toolbar sx={{ 
                        minHeight: 80,
                        display: 'flex',
                        justifyContent: 'space-between',
                        p:2, }}>
                        <Box component={Link} to="/main" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#fff' }}>
                            {/* 홈페이지 로고 or 아이콘 */}
                            <Typography variant='h4' sx={{ fontWeight: 700 }}>
                                ポーピー
                            </Typography>
                        </Box>
                        {/* 우측 버튼 영역 */}
                        <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1}>
                            <Button component={Link} to="/posts" variant='text' sx={{ color: '#fff' }} >게시판</Button>
                            <Button component={Link} to="/events" variant='text' sx={{ color: '#fff' }} >이벤트</Button>
                            <Button component={Link} to="/map" variant='text' sx={{ color: '#fff' }} >지도</Button>
                            <Button component={Link} to="/mypage" variant='text' sx={{ color: '#fff' }} >마이페이지</Button>
                            <Button variant='text' sx={{ color: '#fff' }} onClick={handleLogout}>로그아웃</Button>
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* 하단 화면 */}
            <Container component="main" maxWidth='md' sx={{ pt: 12, mb: 4 }}>
                <Outlet />
            </Container>
        </Box>
    );
}

export default AppLayout;