package com.example.backend.controller;

import com.example.backend.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    @PostMapping("/image")
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = fileService.saveImage(file);
        return Map.of("imageUrl", imageUrl);
    }

    // 이미지 업로드
    @PostMapping("/images")
    public ResponseEntity<Map<String, String>> uploadPostImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = fileService.saveImage(file); // "/images/xxxx.png"
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }

}
