import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import "./PostList.css";

// 너희 프로젝트에 이미 있는 fetchPosts를 그대로 사용한다고 가정
// (이 경로/함수명은 너희가 이전에 쓰던 패턴 그대로)
import { fetchPosts } from "../../api/postsApi";

export default function PostList() {
    const navigate = useNavigate();

    // 페이지/검색/내 글 보기 상태
    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [onlyMine, setOnlyMine] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["posts", page, keyword, onlyMine],
        queryFn: () => fetchPosts({ page, size: 10, keyword, mine: onlyMine }),
        placeholderData: keepPreviousData,
    });

    // 서버 응답 형태가 팀마다 달라서 안전하게 파싱
    const parsed = useMemo(() => {
        // 가능한 케이스들:
        // 1) { items, page, size, totalPages, totalElements }
        // 2) Spring Data: { content, number, size, totalPages, totalElements }
        // 3) 그냥 배열
        if (Array.isArray(data)) {
            return { items: data, totalPages: 1 };
        }

        const items = data?.items ?? data?.content ?? [];
        const totalPages = data?.totalPages ?? 1;

        return { items, totalPages };
    }, [data]);

    const items = parsed.items;
    const totalPages = parsed.totalPages;

    const onSearchSubmit = (e) => {
        e.preventDefault();
        setPage(0);
    };

    const goToDetail = (postId) => {
        // 라우트가 아직 없으면 나중에 /posts/:postId로 맞춰도 됨
        navigate(`/posts/${postId}`);
    };

    const goPrev = () => setPage((p) => Math.max(0, p - 1));
    const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

    // 페이지 버튼(캡처처럼: 1 2 3 ... 67 68)
    const pageButtons = useMemo(() => {
        const current = page + 1; // 표시용
        const last = totalPages;

        // totalPages가 작으면 전부 표시
        if (last <= 8) return Array.from({ length: last }, (_, i) => i + 1);

        // 큰 경우: 1 2 3 ... last-1 last 형태로
        const head = [1, 2, 3];
        const tail = [last - 1, last];
        const set = new Set([...head, ...tail, current]);

        const arr = [...set].filter((n) => n >= 1 && n <= last).sort((a, b) => a - b);

        // ellipsis 위치 판단용
        return arr;
    }, [page, totalPages]);

    return (
        <div className="boardPage">
            <div className="boardWrap">
                {/* 검색바 */}
                <form className="searchRow" onSubmit={onSearchSubmit}>
                    <div className="searchPill">
                        <input
                            className="searchInput"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Hinted search text"
                        />
                        <button className="searchIcon" type="submit" aria-label="검색">
                            🔍
                        </button>
                    </div>

                    <button
                        type="button"
                        className="myPostBtn"
                        onClick={() => {
                            setOnlyMine((v) => !v);
                            setPage(0);
                        }}
                    >
                        {onlyMine ? "전체 글 보기" : "내 글 보기"}
                    </button>
                </form>

                {/* 테이블 */}
                <div className="tableCard">
                    <table className="postTable">
                        <thead className="srOnly">
                            <tr>
                                <th>No</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>작성일</th>
                                <th>조회수</th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td className="emptyRow" colSpan={5}>
                                        불러오는 중...
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td className="emptyRow" colSpan={5}>
                                        목록을 불러오지 못했습니다.
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !isError && items.length === 0 && (
                                <tr>
                                    <td className="emptyRow" colSpan={5}>
                                        게시글이 없습니다.
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                !isError &&
                                items.map((p) => {
                                    const id = p.postId ?? p.id ?? p.no ?? 0;
                                    const title = p.title ?? "(제목 없음)";
                                    const author = p.author?.nickname ?? p.authorName ?? p.writer ?? "-";
                                    const date = (p.createdAt ?? p.createdDate ?? p.date ?? "").toString().slice(0, 10);
                                    const views = p.viewCount ?? p.views ?? 0;

                                    return (
                                        <tr key={id} className="postRow" onClick={() => goToDetail(id)}>
                                            <td className="colNo">{id}</td>
                                            <td className="colTitle">
                                                <span className="titleText">{title}</span>
                                            </td>
                                            <td className="colAuthor">{author}</td>
                                            <td className="colDate">{date}</td>
                                            <td className="colViews">{Number(views).toLocaleString()}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                {/* 글 작성 버튼 */}
                <div className="writeRow">
                    <button
                        className="writeBtn"
                        type="button"
                        onClick={() => navigate("/posts/new")}
                    >
                        글 작성
                    </button>
                </div>

                {/* 페이지네이션 */}
                <div className="pager">
                    <button className="pagerBtn" onClick={goPrev} disabled={page === 0}>
                        ← Previous
                    </button>

                    <div className="pagerNums">
                        {(() => {
                            if (totalPages <= 1) return null;

                            const last = totalPages;

                            // 표시용 번호 리스트에 ... 넣기
                            const nums = pageButtons;

                            const result = [];
                            for (let i = 0; i < nums.length; i++) {
                                const n = nums[i];
                                const prev = nums[i - 1];

                                if (i > 0 && n - prev > 1) {
                                    result.push(
                                        <span key={`dots-${prev}-${n}`} className="dots">
                                            ...
                                        </span>
                                    );
                                }

                                result.push(
                                    <button
                                        key={n}
                                        className={`numBtn ${n === page + 1 ? "active" : ""}`}
                                        onClick={() => setPage(n - 1)}
                                        type="button"
                                    >
                                        {n}
                                    </button>
                                );
                            }

                            // 캡처처럼 마지막 쪽도 자연스럽게
                            // (이미 nums에 last-1,last가 들어가도록 구성됨)
                            return result;
                        })()}
                    </div>

                    <button className="pagerBtn" onClick={goNext} disabled={page >= totalPages - 1}>
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
}
