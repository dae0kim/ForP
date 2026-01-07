import { Box } from "@mui/material";

// 게시글 내용 출력 컴포넌트
function PostDetailContent({ content }) {
    return (
        <Box sx={{ mb: 8 }}>
            <div className="ql-snow">
                <div
                    className="ql-editor"
                    style={{ padding: 0, fontSize: "16px", lineHeight: 1.8, color: "#334155" }}
                    dangerouslySetInnerHTML={{ __html: content ?? "" }}
                />
            </div>
        </Box>
    );
}

export default PostDetailContent;