package com.example.backend.controller;

import com.example.backend.domain.PostImage;
import com.example.backend.repository.PostImageRepository;
import com.example.backend.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageUploadController {

    private final FileService fileService;
    private final PostImageRepository postImageRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadEditorImage(@RequestParam("file") MultipartFile file) {

        String imageUrl = fileService.savePostImage(file);

        PostImage postImage = PostImage.builder()
                .imageUrl(imageUrl)
                .imageName(file.getOriginalFilename())
                .build();

        PostImage saved = postImageRepository.save(postImage);

        return ResponseEntity.ok(imageUrl);
    }
}