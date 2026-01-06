import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import "./PostCreate.css";
import { fetchPostDetail, updatePost, uploadImage } from "../../api/postsApi";

export default function PostEdit() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const qc = useQueryClient();
    const quillRef = useRef(null);

    const myId = useMemo(() => {
        try {
            const raw = localStorage.getItem("loginUser");
            const u = raw ? JSON.parse(raw) : null;
            return u?.id ?? null;
        } catch {
            return null;
        }
    }, []);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["post", postId],
        queryFn: () => fetchPostDetail(postId),
        enabled: !!postId,
    });

    const post = data?.data ?? data?.result ?? data ?? null;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrls, setImageUrls] = useState([]); // 게시글에 포함된 이미지들 관리

    // 데이터 초기 로드
    useEffect(() => {
        if (post) {
            setTitle(post.title ?? "");
            setContent(post.content ?? "");
            setImageUrls(post.imageUrls || []);
        }
    }, [post]);

    useEffect(() => {
        const postAuthorId = post?.author?.id ?? post?.authorId ?? post?.memberId ?? post?.userId ?? null;
        const isOwner = myId != null && postAuthorId != null && Number(myId) === Number(postAuthorId);

        if (!isLoading && post && !isOwner) {
            alert("본인이 작성한 글만 수정할 수 있습니다.");
            navigate(`/posts/${postId}`, { replace: true });
        }
    }, [isLoading, post, myId, navigate, postId]);

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                try {
                    const url = await uploadImage(file);
                    const editor = quillRef.current.getEditor();
                    const range = editor.getSelection();
                    editor.insertEmbed(range.index, "image", url);
                    setImageUrls((prev) => [...prev, url]);
                } catch (error) {
                    console.error("이미지 업로드 실패:", error);
                }
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["image", "link"],
                ["clean"],
            ],
            handlers: { image: imageHandler },
        },
    }), []);

    const mut = useMutation({
        mutationFn: async () => {
            return updatePost(postId, {
                title,
                content,
                imageUrls,
            });
        },
        onSuccess: () => {
            alert("수정 완료");
            qc.invalidateQueries({ queryKey: ["post", postId] }); // 상세 데이터 갱신
            navigate(`/posts/${postId}`);
        },
        onError: (e) => {
            console.error(e);
            alert("수정 실패");
        },
    });

    if (isLoading) return <div className="pcPage">불러오는 중...</div>;
    if (isError || !post) return <div className="pcPage">게시글을 불러오지 못했습니다.</div>;

    return (
        <div className="pcPage">
            <h2 className="pcBoardTitle">자유게시판</h2>

            <div className="pcCard">
                <div className="pcHeaderRow">
                    <h3 className="pcHead">글 수정</h3>
                </div>

                <input
                    className="pcInput"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요."
                />

                {/* ReactQuill 적용 */}
                <div className="pcQuillWrapper" style={{ marginBottom: "20px" }}>
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        style={{ height: "400px", marginBottom: "50px" }}
                    />
                </div>

                <div className="pcBottomRow">
                    <div className="pcActions" style={{ marginLeft: "auto" }}>
                        <button
                            className="pcCancelBtn"
                            type="button"
                            onClick={() => navigate(`/posts/${postId}`)}
                            disabled={mut.isPending}
                        >
                            취소
                        </button>
                        <button
                            className="pcSubmitBtn"
                            type="button"
                            onClick={() => mut.mutate()}
                            disabled={mut.isPending}
                        >
                            수정 완료
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}