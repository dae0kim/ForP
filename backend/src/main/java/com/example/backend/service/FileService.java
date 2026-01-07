package com.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_EXT = Set.of("jpg", "jpeg", "png");

    // 저장
    public String saveImage(MultipartFile file) {
        validate(file);

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String ext = getExtLower(file.getOriginalFilename());

            String normalizedExt = ext.equals("jpeg") ? "jpg" : ext;

            String newFileName = UUID.randomUUID() + "." + normalizedExt;
            Path target = uploadPath.resolve(newFileName).normalize();

            if (!target.startsWith(uploadPath)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 접근입니다.");
            }

            file.transferTo(target.toFile());

            return "/images/" + newFileName;
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("File upload failed", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드 실패");
        }
    }

    // 삭제
    public void deleteImage(String imageUrl) {
        if(imageUrl == null || imageUrl.isBlank()) return;

        // "/images/파일명" -> 파일명
        String fileName = imageUrl.replace("/images/", ""); // 앞에 있는걸 뒤에있는걸로 바꾸겠다?

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path target = uploadPath.resolve(fileName).normalize();

        // deleteIfExists : 파일 있으면 실행 없으면 실행 x
        try {
            Files.deleteIfExists(target);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 삭제 중 오류 발생", e);
        }
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일이 비어있습니다.");
        }

        if (file.getSize() > MAX_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 용량은 최대 5MB입니다.");
        }

        String ext = getExtLower(file.getOriginalFilename());
        if (!ALLOWED_EXT.contains(ext)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용 형식: jpg, jpeg, png");
        }

        // content-type도 같이 체크(우회 방지용 보조)
        String contentType = file.getContentType();
        if (contentType == null || !(contentType.equalsIgnoreCase("image/jpeg")
                || contentType.equalsIgnoreCase("image/jpg")
                || contentType.equalsIgnoreCase("image/png"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미지 파일만 업로드 가능합니다.");
        }
    }

    private String getExtLower(String filename) {
        if (filename == null) return "";
        int idx = filename.lastIndexOf('.');
        if (idx < 0) return "";
        return filename.substring(idx + 1).toLowerCase();
    }

    // 게시판 전용 이미지 저장 메서드
    public String savePostImage(MultipartFile file) {
        validate(file);

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String ext = getExtLower(file.getOriginalFilename());
            String normalizedExt = ext.equals("jpeg") ? "jpg" : ext;

            String newFileName = UUID.randomUUID() + "." + normalizedExt;
            Path target = uploadPath.resolve(newFileName).normalize();

            if (!target.startsWith(uploadPath)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 접근입니다.");
            }

            file.transferTo(target.toFile());

            return "/images/" + newFileName;
        } catch (Exception e) {
            log.error("Post image upload failed", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 이미지 업로드 실패");
        }
    }
}

