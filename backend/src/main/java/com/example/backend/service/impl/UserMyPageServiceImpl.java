package com.example.backend.service.impl;

import com.example.backend.domain.User;
import com.example.backend.dto.response.UserMyPageResponse;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserMyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserMyPageServiceImpl implements UserMyPageService {

    private final UserRepository userRepository;

    // 회원 정보 조회
    @Override
    @Transactional(readOnly = true)
    public UserMyPageResponse getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        return UserMyPageResponse.from(user);
    }
}
