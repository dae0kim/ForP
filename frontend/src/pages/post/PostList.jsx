import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Box, Container, Button, Stack } from "@mui/material";

import { fetchPosts } from "../../api/postsApi";
import PostSearch from "../../components/post/PostSearch";
import PostTable from "../../components/post/PostTable";
import PostPagination from "../../components/post/PostPagination";

export default function PostList() {
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [onlyMine, setOnlyMine] = useState(false);

    // 검색어 입력시 페이지 번호 0으로 리셋
    useEffect(() => {
        setPage(0);
    }, [keyword, onlyMine]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["posts", page, keyword, onlyMine],
        queryFn: () => fetchPosts({ page, size: 10, keyword, mine: onlyMine }),
        placeholderData: keepPreviousData,
    });

    const { items, totalPages } = useMemo(() => ({
        items: data?.items ?? data?.content ?? [],
        totalPages: data?.totalPages ?? 1
    }), [data]);

    const onSearchSubmit = (e) => {
        e.preventDefault();
        setPage(0);
    };

    return (
        <Stack direction="row" justifyContent="center">
            <Box sx={{ width: "100%", minHeight: "100vh", py: 4 }}>
                <Container maxWidth="xl">
                    {/* --- 검색바 --- */}
                    <PostSearch
                        keyword={keyword} setKeyword={setKeyword}
                        onlyMine={onlyMine} setOnlyMine={setOnlyMine}
                        onSearch={onSearchSubmit}
                    />

                    {/* --- 게시글 목록 --- */}
                    <PostTable
                        items={items} isLoading={isLoading}
                        isError={isError}
                    />

                    {/* --- 글 작성 버튼 --- */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 3 }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/posts/new")}
                            sx={{
                                bgcolor: "#bfe3ff",
                                color: "#1f2a37",
                                fontSize: "20px",
                                boxShadow: "none",
                                borderRadius: "10px",
                                border: "1px solid #a8d7ff",
                                "&:hover": { bgcolor: "#aedbff", boxShadow: "none" },
                            }}
                        >
                            글 작성
                        </Button>
                    </Box>

                    {/* --- 페이지네이션 --- */}
                    <PostPagination
                        totalPages={totalPages}
                        currentPage={page}
                        onPageChange={setPage}
                    />
                </Container>
            </Box>
        </Stack>
    );
}
