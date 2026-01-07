import { Box, Container, Stack, Button, AppBar, Toolbar, Typography } from '@mui/material';
import { Link, NavLink, Outlet } from 'react-router';

function AppLayout() {
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/"; // ok
    }

    return (
        <Box>
            <AppBar position='fixed'>
                <Container maxWidth="xl" sx={{ px: 10 }}>
                    <Toolbar sx={{
                        minHeight: 80,
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 2,
                    }}>
                        <Box component={Link} to="/main" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#fff' }}>
                            {/* 홈페이지 로고 or 아이콘 */}
                            <Typography variant='h4' sx={{ fontWeight: 700 }}>
                                ポーピー
                            </Typography>
                        </Box>
                        {/* 우측 버튼 영역 */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                            {[
                                {label:"게시판", to:"/posts"},
                                {label:"이벤트", to:"/events"},
                                {label:"지도", to:"/map"},
                                {label:"마이페이지", to:"/mypage"},
                            ].map((menu) => (
                                <Button 
                                key={menu.to}
                                component={NavLink}
                                to={menu.to}
                                sx={{
                                    color:'#fff',
                                    fontSize:'20px',
                                    px:2,
                                    borderRadius:2,
                                    "&.active":{
                                        color:"#000",
                                        fontWeight:"bold"
                                    },
                                    "&:hover":{
                                        backgroundColor:"rgba(255,255,255,0.15)",
                                    }
                                }}
                                >{menu.label}</Button>
                            ))}
                            <Button variant='text' sx={{ color: '#fff',fontSize:'20px'}} onClick={handleLogout}>로그아웃</Button>
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
