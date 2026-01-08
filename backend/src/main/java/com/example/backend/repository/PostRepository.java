package com.example.backend.repository;

import com.example.backend.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 제목 검색
    Page<Post> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    // 내 글 필터 + 검색
    Page<Post> findByUserIdAndTitleContainingIgnoreCase(Long userId, String title, Pageable pageable);

    // 내 글 필터
    Page<Post> findByUserId(Long userId, Pageable pageable);

}

