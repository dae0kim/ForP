import React from 'react';

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
        <div>
            <h1>로그인</h1>
            <button onClick={kakaoLogin}>카카오 로그인</button>
        </div>
    );
}

export default Login;