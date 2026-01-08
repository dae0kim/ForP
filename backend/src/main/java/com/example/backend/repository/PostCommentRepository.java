package com.example.backend.repository;

import com.example.backend.domain.Post;
import com.example.backend.domain.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostCommentRepository extends JpaRepository<PostComment,Long> {

    // 특정 게시글의 댓글을 작성일 기준으로 오름차순 정렬
    List<PostComment> findByPostOrderByRgstDateAsc(Post post);

    void deleteByPostId(Long postId);

}