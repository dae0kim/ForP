import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { kakaoLogin, getMe } from '../../api/authApi'

function KakaoRedirect() {

    const navigate = useNavigate();
    const calledRef = useRef(false);

    useEffect(() => {
        // React StrictMode 대응 (2번 실행 방지)
        if (calledRef.current) return;
        calledRef.current = true;

        const code = new URL(window.location.href)
            .searchParams
            .get("code");

        if (!code) return;

        (async () => {
            try {
                // 카카오 로그인 → JWT 수신
                const token = await kakaoLogin(code);

                // JWT 저장
                localStorage.setItem("accessToken", token);

                // 내 정보 조회
                // const user = await getMe(token);
                const user = await getMe();

                alert(`${user.nickname}님 환영합니다`);

                // 로그인 유저 저장
                localStorage.setItem("loginUser", JSON.stringify(user));

                navigate("/main");

            } catch (err) {
                console.error("로그인 실패", err);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("loginUser");
                // 다시 로그인 화면으로 이동
                navigate("/");
            }
        })();

    }, []);

    return <div>카카오 로그인 처리 중...</div>;
}

export default KakaoRedirect;