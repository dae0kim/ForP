package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "post_image")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_image_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    public static PostImage of(Post post, String imageUrl) {
        return PostImage.builder()
                .post(post)
                .imageUrl(imageUrl)
                .build();
    }
}

