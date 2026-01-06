import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import "./PostDetail.css";
import { fetchPostDetail, deletePost } from "../../api/postsApi";
import {
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
} from "../../api/commentsApi";

import "react-quill-new/dist/quill.snow.css";

/*
 * - 작성자 아니면 글 수정/삭제 버튼 숨김
 * - 삭제 클릭 시 confirm("삭제 하시겠습니까?") 확인 후 삭제
 * - 삭제 성공 시 alert("삭제되었습니다.") 후 목록(/posts) 이동
 * - 첨부 사진 있으면 본문 아래 출력
 * - 글 수정된 경우 (수정됨) 표시
 * - 댓글: 공백만 X, 1~300자, 최신순
 * - 댓글 수정/삭제: 본인만 버튼 노출, 수정 시 (수정됨) 표시
 */
export default function PostDetail() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const qc = useQueryClient();

    // loginUser(JSON)에서 내 id 읽기
    const myId = useMemo(() => {
        try {
            const raw = localStorage.getItem("loginUser");
            const u = raw ? JSON.parse(raw) : null;
            return u?.id ?? null;
        } catch {
            return null;
        }
    }, []);

    const [commentText, setCommentText] = useState("");
    const [commentError, setCommentError] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    // 게시글 상세
    const postQuery = useQuery({
        queryKey: ["post", postId],
        queryFn: () => fetchPostDetail(postId),
        enabled: !!postId,
    });

    // 댓글 목록
    const commentsQuery = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchComments(postId),
        enabled: !!postId,
    });

    // 댓글 작성
    const createMut = useMutation({
        mutationFn: (content) => createComment(postId, content),
        onSuccess: async () => {
            setCommentText("");
            setCommentError("");
            await qc.invalidateQueries({ queryKey: ["comments", postId] });
            await qc.invalidateQueries({ queryKey: ["post", postId] }); // 댓글 수 반영용
        },
        onError: (e) => {
            console.error(e);
            alert("댓글 등록 실패");
        },
    });

    // 댓글 수정
    const updateMut = useMutation({
        mutationFn: ({ commentId, content }) =>
            updateComment(postId, commentId, content),
        onSuccess: async () => {
            setEditingId(null);
            setEditingText("");
            await qc.invalidateQueries({ queryKey: ["comments", postId] });
        },
        onError: (e) => {
            console.error(e);
            alert("댓글 수정 실패");
        },
    });

    // 댓글 삭제
    const deleteMut = useMutation({
        mutationFn: (commentId) => deleteComment(postId, commentId),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["comments", postId] });
            await qc.invalidateQueries({ queryKey: ["post", postId] });
        },
        onError: (e) => {
            console.error(e);
            alert("댓글 삭제 실패");
        },
    });

    // 게시글 삭제
    const deletePostMut = useMutation({
        mutationFn: () => deletePost(postId),
        onSuccess: async () => {
            alert("삭제되었습니다.");

            // 목록 갱신용(선택)
            await qc.invalidateQueries({ queryKey: ["posts"] });

            // 목록으로 이동
            navigate("/posts", { replace: true });
        },
        onError: (e) => {
            console.error(e);
            const status = e?.response?.status;
            if (status === 401) return alert("로그인이 필요합니다.");
            if (status === 403) return alert("삭제 권한이 없습니다.");
            alert("삭제 실패");
        },
    });

    // 응답 파싱
    const post = useMemo(() => {
        const d = postQuery.data;
        return d?.data ?? d?.result ?? d ?? null;
    }, [postQuery.data]);

    const comments = useMemo(() => {
        const d = commentsQuery.data;
        const list = Array.isArray(d)
            ? d
            : d?.items ?? d?.content ?? d?.data?.items ?? d?.data?.content ?? [];

        // 최신순
        return [...list].sort((a, b) => {
            const at = new Date(a.createdAt ?? a.createdDate ?? 0).getTime();
            const bt = new Date(b.createdAt ?? b.createdDate ?? 0).getTime();
            return bt - at;
        });
    }, [commentsQuery.data]);

    // 화면 표시용 유틸
    const fmtDate = (v) => {
        if (!v) return "";
        const s = v.toString();
        return s.slice(0, 10).replaceAll("-", ".");
    };

    const postAuthorId =
        post?.author?.id ?? post?.memberId ?? post?.userId ?? post?.writerId ?? null;

    const isPostOwner =
        myId != null && postAuthorId != null && Number(myId) === Number(postAuthorId);

    const createdAt = post?.createdAt ?? post?.createdDate;
    const updatedAt = post?.updatedAt ?? post?.updateAt ?? post?.modifiedAt;

    const createdText = fmtDate(createdAt);
    const updatedText = fmtDate(updatedAt);
    const isEdited = updatedText && createdText && updatedText !== createdText;

    const viewCount = post?.readCount ?? post?.viewCount ?? post?.views ?? 0;
    const commentCount = post?.commentCount ?? comments.length;

    const authorName =
        post?.author?.nickname ??
        post?.authorNickname ??
        post?.writerNickname ??
        post?.writer ??
        "-";

    const imageUrl = post?.imageUrl ?? null;

    // 댓글 입력 검증
    const validateComment = (text) => {
        const trimmed = text.trim();
        if (!trimmed) return "공백만 입력할 수 없습니다.";
        if (trimmed.length > 300) return "댓글은 300자 이하로 입력해 주세요.";
        return "";
    };

    const onSubmitComment = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        const err = validateComment(commentText);
        if (err) {
            setCommentError(err);
            return;
        }
        createMut.mutate(commentText.trim());
    };

    const startEdit = (c) => {
        const cid = c.id ?? c.commentId;
        setEditingId(cid);
        setEditingText(c.content ?? "");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingText("");
    };

    const submitEdit = () => {
        const err = validateComment(editingText);
        if (err) return alert(err);
        updateMut.mutate({ commentId: editingId, content: editingText.trim() });
    };

    // ✅ 게시글 삭제 클릭 핸들러 (confirm + alert)
    const onClickDeletePost = () => {
        if (!isPostOwner) return;

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        const ok = window.confirm("삭제 하시겠습니까?");
        if (!ok) return;

        deletePostMut.mutate();
    };

    // 로딩/에러
    if (postQuery.isLoading) return <div className="pdPage">불러오는 중...</div>;

    if (postQuery.isError || !post) {
        return (
            <div className="pdPage">
                <h2 className="pdBoardTitle">자유게시판</h2>
                <div className="pdCard">게시글을 불러오지 못했습니다.</div>
            </div>
        );
    }

    return (
        <div className="pdPage">
            <h2 className="pdBoardTitle">자유게시판</h2>

            <div className="pdCard">
                {/* 제목 */}
                <div className="pdTitleRow">
                    <h1 className="pdTitle">{post.title ?? "(제목 없음)"}</h1>

                    {/* 작성자만 글 수정/삭제 버튼 노출 */}
                    {isPostOwner && (
                        <div className="pdPostActions">
                            <button
                                type="button"
                                className="pdLinkBtn"
                                onClick={() => navigate(`/posts/${postId}/edit`)}
                            >
                                수정
                            </button>

                            <button
                                type="button"
                                className="pdLinkBtn danger"
                                onClick={onClickDeletePost}
                                disabled={deletePostMut.isPending}
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </div>

                <div className="pdLine" />

                {/* 메타정보 */}
                <div className="pdMetaRow">
                    <div className="pdAvatar" aria-hidden />
                    <div className="pdMetaText">
                        <span className="pdAuthor">{authorName}</span>
                        <span className="pdMetaDot" />
                        <span className="pdMeta">{createdText}</span>
                        {isEdited && <span className="pdEdited">(수정 {updatedText})</span>}
                        <span className="pdMetaDot" />
                        <span className="pdMeta">조회 {Number(viewCount).toLocaleString()}</span>
                        <span className="pdMetaDot" />
                        <span className="pdMeta">댓글 {Number(commentCount).toLocaleString()}</span>
                    </div>
                </div>

                {/* 본문 */}
                <div className="pdContent ql-snow">
                    <div
                        className="ql-editor"
                        dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
                    />
                </div>

                <div className="pdDivider" />

                {/* 댓글 */}
                <div className="pdSectionTitle">댓글</div>

                <form className="pdCommentForm" onSubmit={onSubmitComment}>
                    <input
                        className="pdCommentInput"
                        value={commentText}
                        onChange={(e) => {
                            setCommentText(e.target.value);
                            if (commentError) setCommentError("");
                        }}
                        placeholder="댓글을 입력하세요"
                    />
                    <button className="pdCommentBtn" type="submit" disabled={createMut.isPending}>
                        등록
                    </button>
                </form>

                {commentError && <div className="pdError">{commentError}</div>}

                <div className="pdComments">
                    {commentsQuery.isLoading && <div className="pdEmpty">댓글 불러오는 중...</div>}
                    {commentsQuery.isError && <div className="pdEmpty">댓글을 불러오지 못했습니다.</div>}
                    {!commentsQuery.isLoading && !commentsQuery.isError && comments.length === 0 && (
                        <div className="pdEmpty">댓글이 없습니다.</div>
                    )}

                    {!commentsQuery.isLoading &&
                        !commentsQuery.isError &&
                        comments.map((c) => {
                            const cid = c.id ?? c.commentId;
                            const cAuthorId =
                                c.author?.id ?? c.memberId ?? c.userId ?? c.writerId ?? null;

                            const isCommentOwner =
                                myId != null && cAuthorId != null && Number(myId) === Number(cAuthorId);

                            const cAuthor =
                                c.author?.nickname ??
                                c.authorNickname ??
                                c.writerNickname ??
                                c.writer ??
                                "-";

                            const cCreated = fmtDate(c.createdAt ?? c.createdDate);
                            const cUpdated = fmtDate(c.updatedAt ?? c.updateAt ?? c.modifiedAt);
                            const cEdited = cUpdated && cCreated && cUpdated !== cCreated;

                            const isEditing = editingId === cid;

                            return (
                                <div key={cid} className="pdCommentItem">
                                    <div className="pdAvatar sm" aria-hidden />

                                    <div className="pdCommentBody">
                                        <div className="pdCommentHead">
                                            <div className="pdCommentInfo">
                                                <span className="pdAuthor">{cAuthor}</span>
                                                <span className="pdMetaDot" />
                                                <span className="pdMeta">{cCreated}</span>
                                                {cEdited && <span className="pdEdited">(수정됨)</span>}
                                            </div>

                                            {/* 댓글 수정/삭제: 작성자만 버튼 노출 */}
                                            {isCommentOwner && !isEditing && (
                                                <div className="pdCommentActions">
                                                    <button type="button" className="pdMiniBtn" onClick={() => startEdit(c)}>
                                                        수정
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="pdMiniBtn danger"
                                                        onClick={() => deleteMut.mutate(cid)}
                                                        disabled={deleteMut.isPending}
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {!isEditing ? (
                                            <div className="pdCommentText">{c.content ?? ""}</div>
                                        ) : (
                                            <div className="pdEditRow">
                                                <input
                                                    className="pdEditInput"
                                                    value={editingText}
                                                    onChange={(e) => setEditingText(e.target.value)}
                                                />
                                                <div className="pdEditActions">
                                                    <button
                                                        type="button"
                                                        className="pdMiniBtn"
                                                        onClick={submitEdit}
                                                        disabled={updateMut.isPending}
                                                    >
                                                        저장
                                                    </button>
                                                    <button type="button" className="pdMiniBtn" onClick={cancelEdit}>
                                                        취소
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
