import { Box, Button } from '@mui/material';
import kakaoButtonImg from '../../assets/images/kakao_login_large_narrow.png'

function Login() {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = "http://localhost:5173/auth/kakao";

    const kakaoLogin = () => {
        // 카카오 로그인 api 기본설정이므로 oauth 사용
        window.location.href =
            `https://kauth.kakao.com/oauth/authorize` +
            `?client_id=${REST_API_KEY}` +
            `&redirect_uri=${REDIRECT_URI}` +
            `&response_type=code` +
            `&prompt=login`;
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
                onClick={kakaoLogin}
                sx={{
                    padding: 0,
                    minWidth: 'auto',
                    overflow: 'hidden',
                    borderRadius: '6px',
                    '&:hover': {
                        backgroundColor: 'transparent',
                        opacity: 0.9
                    }
                }}
            >
                <img src={kakaoButtonImg} alt="카카오 로그인" style={{ display: 'block', width: '100%' }} />
            </Button>
        </Box>
    );
}

export default Login;