import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import "./PostCreate.css";
import { fetchPostDetail, updatePost, uploadImage } from "../../api/postsApi";

export default function PostEdit() {
    const navigate = useNavigate();
    const { postId } = useParams();

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

    const postAuthorId =
        post?.author?.id ??
        post?.authorId ??
        post?.member?.id ??
        post?.user?.id ??
        post?.memberId ??
        post?.userId ??
        post?.writerId ??
        null;

    const isOwner =
        myId != null && postAuthorId != null && Number(myId) === Number(postAuthorId);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // ✅ 이미지 상태
    const [file, setFile] = useState(null);            // 새로 선택한 파일
    const [previewUrl, setPreviewUrl] = useState("");  // 로컬 미리보기
    const [imageUrl, setImageUrl] = useState("");      // 서버에 저장된 경로 (/images/xxx.png)

    useEffect(() => {
        if (post) {
            setTitle(post.title ?? "");
            setContent(post.content ?? "");
            setImageUrl(post.imageUrl ?? "");
            setPreviewUrl(""); // 기존 이미지면 프리뷰는 비움(아래에서 imageUrl로 보여줌)
            setFile(null);
        }
    }, [post]);

    useEffect(() => {
        if (!isLoading && post && !isOwner) {
            alert("본인이 작성한 글만 수정할 수 있습니다.");
            navigate(`/posts/${postId}`, { replace: true });
        }
    }, [isLoading, post, isOwner, navigate, postId]);

    // ✅ 파일 선택
    const onPickFile = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;

        setFile(f);
        setPreviewUrl(URL.createObjectURL(f)); // 로컬 미리보기
    };

    // ✅ 이미지 제거(기존 이미지/새 이미지 둘 다 제거)
    const onRemoveImage = () => {
        setFile(null);
        setPreviewUrl("");
        setImageUrl(""); // 서버에 저장된 것도 제거한다고 가정(업데이트 시 빈 값으로 전달)
    };

    const mut = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }

            let finalImageUrl = imageUrl;

            // ✅ 새 파일을 선택했으면 업로드 후 imageUrl 갱신
            if (file) {
                finalImageUrl = await uploadImage(file); // "/images/xxx.png" 기대
            }

            return updatePost(postId, {
                title,
                content,
                imageUrl: finalImageUrl || null,
            });
        },
        onSuccess: () => {
            alert("수정 완료");
            navigate(`/posts/${postId}`);
        },
        onError: (e) => {
            console.error(e);
            alert("수정 실패");
        },
    });

    if (isLoading) return <div className="pcPage">불러오는 중...</div>;
    if (isError || !post) return <div className="pcPage">게시글을 불러오지 못했습니다.</div>;
    if (!isOwner) return null;

    // ✅ 화면에 보여줄 이미지 src
    // - 새 파일 선택 시: previewUrl
    // - 기존 이미지 있을 시: imageUrl
    const imgSrc = previewUrl || imageUrl;

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

                <textarea
                    className="pcTextarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요."
                />

                {/* ✅ 이미지 미리보기 */}
                {imgSrc && (
                    <div style={{ marginTop: 12 }}>
                        <img
                            src={imgSrc}
                            alt="첨부 이미지"
                            style={{ maxWidth: "100%", borderRadius: 10, border: "1px solid #e5e7eb" }}
                        />
                    </div>
                )}

                <div className="pcBottomRow">
                    <div className="pcFileRow">
                        {/* 실제 파일 input */}
                        <label className="pcFileBtn" style={{ cursor: "pointer" }}>
                            이미지 첨부
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onPickFile}
                                style={{ display: "none" }}
                            />
                        </label>

                        <span className="pcFileName">
                            {file?.name || (imageUrl ? imageUrl.split("/").pop() : "선택된 파일 없음")}
                        </span>

                        {/* 이미지 제거 버튼 */}
                        {(file || imageUrl) && (
                            <button type="button" className="pcFileBtn" onClick={onRemoveImage}>
                                이미지 제거
                            </button>
                        )}
                    </div>

                    <div className="pcActions">
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
                            수정
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
