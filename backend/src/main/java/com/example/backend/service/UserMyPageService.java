package com.example.backend.service;

import com.example.backend.dto.response.UserMyPageResponse;

public interface  UserMyPageService {
    UserMyPageResponse getMyInfo(Long userId);
}
