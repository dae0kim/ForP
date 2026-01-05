import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import "./PostCreate.css";
import { createPost, uploadImage } from "../../api/postsApi";

export default function PostCreate() {
    const navigate = useNavigate();
    const fileRef = useRef(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const createMut = useMutation({
        mutationFn: async () => {
            // 1) 이미지가 있으면 먼저 업로드해서 imageUrl 받기
            let imageUrl = null;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile); // "/images/xxxx.png" 같은 값 기대
            }

            // 2) 게시글 작성
            return createPost({ title, content, imageUrl });
        },
        onSuccess: (saved) => {
            // 저장 성공 시 목록으로 이동 (혹은 상세로 이동도 가능)
            navigate("/posts");
        },
        onError: (e) => {
            console.error(e);
            alert("게시글 등록 실패");
        },
    });

    const onPickImage = () => {
        fileRef.current?.click();
    };

    const onChangeFile = (e) => {
        const f = e.target.files?.[0];
        setImageFile(f ?? null);
    };

    const onSubmit = () => {
        if (!title.trim()) return alert("제목을 입력하세요");
        if (!content.trim()) return alert("내용을 입력하세요");
        createMut.mutate();
    };

    return (
        <div className="pcPage">
            <h2 className="pcBoardTitle">자유게시판</h2>

            <div className="pcCard">
                <div className="pcHeaderRow">
                    <h3 className="pcFormTitle">글 등록</h3>

                    {/* 우측 상단 동그란 프로필(스크린샷 느낌) 
          <div className="pcProfileBubble" title="profile">
            S
          </div>
          */}
                </div>

                <input
                    className="pcInput"
                    placeholder="제목을 입력 하세요."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    className="pcTextarea"
                    placeholder="내용을 입력 하세요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                {/* 하단 버튼 영역 */}
                <div className="pcBottomRow">
                    <div className="pcFileRow">
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={onChangeFile}
                            className="pcHiddenFile"
                        />
                        <button type="button" className="pcFileBtn" onClick={onPickImage}>
                            이미지 첨부
                        </button>
                        <span className="pcFileName">
                            {imageFile ? imageFile.name : ""}
                        </span>
                    </div>

                    <div className="pcActionRow">
                        <button
                            type="button"
                            className="pcCancelBtn"
                            onClick={() => navigate(-1)}
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            className="pcSubmitBtn"
                            onClick={onSubmit}
                            disabled={createMut.isPending}
                        >
                            등록
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
