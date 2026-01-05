package com.example.backend.controller;

import com.example.backend.dto.response.UserMyPageResponse;
import com.example.backend.service.UserMyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class UserMyPageController {

    private final UserMyPageService userMyPageService;

    @GetMapping("/me")
    public UserMyPageResponse me() {
        Long userId = 1L;
        return userMyPageService.getMyInfo(userId);
    }

}
