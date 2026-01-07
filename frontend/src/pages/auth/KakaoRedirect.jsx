import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Box, Typography, LinearProgress, Container } from '@mui/material';
import { kakaoLogin, getMe } from '../../api/authApi';
import LoadingImage from '../../assets/images/loading_image.png';

function KakaoRedirect() {
    const navigate = useNavigate();
    const calledRef = useRef(false);

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        const code = new URL(window.location.href).searchParams.get("code");
        if (!code) return;

        (async () => {
            try {
                const token = await kakaoLogin(code);
                localStorage.setItem("accessToken", token);
                const user = await getMe();

                // 로딩 화면 연출용 시간지연 설정
                await new Promise(resolve => setTimeout(resolve, 1500));

                localStorage.setItem("loginUser", JSON.stringify(user));
                navigate("/main");
            } catch (err) {
                console.error("로그인 실패", err);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("loginUser");
                navigate("/");
            }
        })();
    }, [navigate]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#f0f4f8',
                textAlign: 'center',
                px: 3
            }}
        >
            <Container maxWidth="sm">
                {/* 상단 텍스트 */}
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, color: '#2c3e50' }}>
                    로그인 진행 중...
                </Typography>

                {/* 로딩 이미지 */}
                <Box
                    component="img"
                    src={LoadingImage}
                    alt="Loading..."
                    sx={{
                        width: '100%',
                        maxWidth: 400,
                        height: 'auto',
                        mb: 4,
                        borderRadius: 4,
                        animation: 'fadeIn 1s ease-in-out'
                    }}
                />

                {/* 하단 로딩 바 */}
                <Box sx={{ width: '80%', margin: '0 auto' }}>
                    <LinearProgress
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#4dabf7'
                            }
                        }}
                    />
                </Box>
            </Container>

            {/* 애니메이션 효과 */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </Box>
    );
}

export default KakaoRedirect;