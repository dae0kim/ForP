package com.example.backend.repository;

import com.example.backend.domain.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostImageRepository extends JpaRepository<PostImage, Long> {
    // 본문에 포함된 URL 리스트로 PostImage 엔티티 한번에 조회
    List<PostImage> findByImageUrlIn(List<String> imageUrls);
}
