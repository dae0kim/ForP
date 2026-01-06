package com.example.backend.repository;

import com.example.backend.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 제목과 내용에 키워드 포함 검색
    Page<Post> findByTitleContainingIgnoreCaseOrContentContaining(
            String title,
            String content,
            Pageable pageable
            // 첫번째 페이지, 한 페이지에 10개 데이터, 아이디기준 정렬, 내림차순
            // 페이지 번호, 페이지 크기, 정렬
            // Pageable.of(0, 10, Sort.by("id").descending())
    );
}

