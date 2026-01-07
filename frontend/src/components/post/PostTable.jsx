import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// 게시판 목록 호출 컴포넌트
function PostTable({ items, isLoading, isError, isMobile }) {

    const navigate = useNavigate();

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: "10px", border: "1px solid #cfe6ff", bgcolor: "#eef7ff", overflow: "hidden" }}
        >
            <Table size="small">
                <TableBody>
                    {isLoading ? (
                        <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5, color: "#64748b" }}>불러오는 중...</TableCell></TableRow>
                    ) : isError ? (
                        <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5, color: "#64748b" }}>목록을 불러오지 못했습니다.</TableCell></TableRow>
                    ) : items.length === 0 ? (
                        <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5, color: "#64748b" }}>게시글이 없습니다.</TableCell></TableRow>
                    ) : (
                        items.map((p) => {
                            const id = p.postId ?? p.id ?? 0;
                            return (
                                <TableRow
                                    key={id}
                                    onClick={() => navigate(`/posts/${id}`)}
                                    sx={{
                                        cursor: "pointer",
                                        borderTop: "1px solid #d7e9fb",
                                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.35)" }
                                    }}
                                >
                                    <TableCell align="center" sx={{ width: 60, color: "#334155" }}>{id}</TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#1f2a37" }}>
                                            {p.title ?? "(제목 없음)"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ width: 120, color: "#334155" }}>
                                        {p.author?.nickname ?? p.writer ?? "-"}
                                    </TableCell>
                                    <TableCell align="center" sx={{ width: 110, color: "#334155" }}>
                                        {(p.rgstDate ?? "").toString().slice(0, 10)}
                                    </TableCell>
                                    <TableCell align="center" sx={{ width: 90, color: "#334155" }}>
                                        {Number(p.readCount ?? 0).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default PostTable;