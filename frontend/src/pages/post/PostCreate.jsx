import { useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import "./PostCreate.css";
import { createPost, uploadImage } from "../../api/postsApi";

export default function PostCreate() {
    const navigate = useNavigate();
    const quillRef = useRef(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    // 본문에 포함된 이미지 URL들을 저장할 상태 (백엔드 전송용)
    const [imageUrls, setImageUrls] = useState([]);

    // 이미지 핸들러 - 에디터에 이미지를 올리면 실행
    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                try {
                    // 백엔드에 이미지 파일 전송 및 URL 수신
                    const url = await uploadImage(file);

                    // 에디터 현재 커서 위치에 이미지 삽입
                    const editor = quillRef.current.getEditor();
                    const range = editor.getSelection();
                    editor.insertEmbed(range.index, "image", url);

                    // 백엔드에 보낼 이미지 리스트에 추가
                    setImageUrls((prev) => [...prev, url]);
                } catch (error) {
                    console.error("이미지 업로드 실패:", error);
                    alert("이미지 업로드에 실패했습니다.");
                }
            }
        };
    };

    // Quill 모듈 설정
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["image", "link"],
                ["clean"],
            ],
            handlers: {
                image: imageHandler, // 이미지 아이콘 클릭 시 핸들러 실행
            },
        },
    }), []);

    const createMut = useMutation({
        mutationFn: async () => {
            return createPost({ title, content, imageUrls });
        },
        onSuccess: () => {
            navigate("/posts");
        },
        onError: (e) => {
            console.error(e);
            alert("게시글 등록 실패");
        },
    });

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
                </div>

                <input
                    className="pcInput"
                    placeholder="제목을 입력 하세요."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* ReactQuill 에디터 적용 */}
                <div className="pcQuillWrapper">
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        placeholder="내용을 입력 하세요."
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        style={{ height: "400px", marginBottom: "50px" }}
                    />
                </div>

                <div className="pcBottomRow">
                    {/* 기존의 개별 이미지 첨부 버튼 영역은 필요 없으므로 제거하거나 비워둠 */}
                    <div className="pcFileRow"></div>

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