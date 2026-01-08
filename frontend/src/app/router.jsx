import { createBrowserRouter } from "react-router-dom";
import Main from "../pages/Main";
import Login from "../pages/auth/Login";
import KakaoRedirect from "../pages/auth/KakaoRedirect";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layouts/AppLayout";
import PostList from "../pages/post/PostList";
import PostDetail from "../pages/post/PostDetail";
import PostCreate from "../pages/post/PostCreate";
import PostEdit from "../pages/post/PostEdit";
import EventList from "../pages/event/EventList";
import Map from "../pages/Map";
import MyPage from "../pages/MyPage";
import PetRegister from "../pages/PetRegister";
import NotFoundPage from "../pages/NotFoundPage";
import EventDetail from "../pages/event/EventDetail";
import PetEdit from "../pages/PetEdit";

export const router = createBrowserRouter([
    // 최초 화면은 무조건 로그인 화면으로
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/auth/kakao",
        element: <KakaoRedirect />,
    },
    {
        path: "/pet-register",
        element: (
            <ProtectedRoute>
                <PetRegister />
            </ProtectedRoute>
        ),
    },
    {
        path: "/pet-edit/:petId",
        element: (
            <ProtectedRoute>
                <PetEdit />
            </ProtectedRoute>
        ),
    },
    // 로그인 후 메인화면
    {
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/main",
                element: <Main />,
            },
            {
                path: "posts",
                element: <PostList />,
            },
            {
                path: "posts/new",
                element: <PostCreate />, // 게시글 작성
            },
            {
                path: "posts/:postId",
                element: <PostDetail />, // 게시글 상세 조회
            },
            {
                path: "posts/:postId/edit", // 게시글 수정
                element: <PostEdit />,
            },
            {
                path: "/events",
                element: <EventList />,
            },
            {
                path:"events/:id",
                element: <EventDetail />,
            },
            {
                path: "/map",
                element: <Map />,
            },
            {
                path: "/mypage",
                element: <MyPage />,
            },
        ],
    },
    // 404
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);
