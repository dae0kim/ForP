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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "post_image_seq_gen")
    @SequenceGenerator(
            name = "post_image_seq_gen",
            sequenceName = "POST_IMAGE_SEQ",
            allocationSize = 1
    )
    @Column(name = "post_image_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = true)
    private Post post;

    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;

    @Column(name = "image_name")
    private String imageName;

    public void setPost(Post post) {
        this.post = post;
    }

    public static PostImage of(Post post, String imageUrl, String imageName) {
        return PostImage.builder()
                .post(post)
                .imageUrl(imageUrl)
                .imageName(imageName)
                .build();
    }
}

