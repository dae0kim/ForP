package com.example.backend.controller;

import com.example.backend.config.JwtProvider;
import com.example.backend.domain.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.KakaoAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final KakaoAuthService kakaoAuthService;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;


    @PostMapping("/login/kakao")
    public ResponseEntity<String> kakaoLogin(@RequestParam String code) {
        String jwt = kakaoAuthService.kakaoLogin(code);
        return ResponseEntity.ok(jwt);
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7); // Bearer 제거
        Long userId = jwtProvider.getUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

}
