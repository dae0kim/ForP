import { Box, Paper, InputBase, Button } from "@mui/material";

// 게시판 목록 검색창 컴포넌트
function PostSearch({ keyword, setKeyword, onlyMine, setOnlyMine, onSearch }) {
    return (
        <Box
            component="form"
            onSubmit={onSearch}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mb: 4 }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: "6px 18px", display: "flex", alignItems: "center", width: "100%",
                    maxWidth: 500, borderRadius: "999px", bgcolor: "#cfeaff",
                    boxShadow: "0 8px 18px rgba(0, 0, 0, 0.06)",
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1, fontSize: "14px" }}
                    placeholder="검색어를 입력하세요."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </Paper>

            <Button
                variant="outlined"
                onClick={() => setOnlyMine(!onlyMine)}
                sx={{
                    borderRadius: "999px", bgcolor: "white", color: "#1f2a37",
                    borderColor: "#dbeafe", fontSize: "12px", px: 2, whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#f8fbff", borderColor: "#dbeafe" },
                }}
            >
                {onlyMine ? "전체 글 보기" : "내 글 보기"}
            </Button>
        </Box>
    );
}

export default PostSearch;