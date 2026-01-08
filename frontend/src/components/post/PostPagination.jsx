import { Box, Pagination } from "@mui/material";

// 게시판 목록 페이징 컴포넌트
function PostPagination({ totalPages, currentPage, onPageChange }) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
                count={totalPages}
                page={currentPage + 1}
                onChange={(_, value) => onPageChange(value - 1)}
                shape="rounded"
                size="small"
                sx={{
                    "& .MuiPaginationItem-root": { color: "#64748b", border: "none" },
                    "& .MuiPaginationItem-root.Mui-selected": {
                        bgcolor: "#9fd1f6", color: "white", fontWeight: "bold",
                        "&:hover": { bgcolor: "#9fd1f6" }
                    },
                }}
            />
        </Box>
    );
}

export default PostPagination;