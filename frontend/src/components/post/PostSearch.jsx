// 게시판 목록 검색창 컴포넌트
import { Box, Paper, InputBase, Button } from "@mui/material";

function PostSearch({ keyword, setKeyword, onlyMine, setOnlyMine, onSearch }) {
    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4
            }}
        >
            {/* 검색바 */}
            <Box
                component="form"
                onSubmit={onSearch}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%"
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: "6px 18px",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        maxWidth: 500,
                        borderRadius: "999px",
                        bgcolor: "#cfeaff",
                        boxShadow: "0 8px 18px rgba(0, 0, 0, 0.06)",
                    }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1, fontSize: "20px" }}
                        placeholder="제목으로 검색하세요."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </Paper>
            </Box>

            {/* 내 글 보기 버튼 */}
            <Button
                variant="outlined"
                onClick={() => setOnlyMine(!onlyMine)}
                sx={{
                    position: "absolute",
                    right: 0,
                    bottom: -20,
                    borderRadius: "10px",
                    bgcolor: "white",
                    color: "#1f2a37",
                    borderColor: "#eee",
                    fontSize: "20px",
                    px: 1.5,
                    py: 0.5,
                    whiteSpace: "nowrap",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#f8fbff", borderColor: "#ddd" },
                }}
            >
                {onlyMine ? "전체 글 보기" : "내 글 보기"}
            </Button>
        </Box>
    );
}

export default PostSearch;