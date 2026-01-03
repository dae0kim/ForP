import { Navigate } from "react-router";

// 로그인한 사용자만 메인화면 진입하도록 보호
function ProtectedRoute({ children }) {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        // 사용자 인증 토큰 없을 시 다시 로그인화면으로
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;