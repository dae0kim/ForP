package com.example.backend.service;

import com.example.backend.dto.request.MyPage.PetCreateRequest;
import com.example.backend.dto.request.MyPage.PetUpdateRequest;
import com.example.backend.dto.response.UserPetResponse;

import java.util.List;

public interface UserPetService {
    // 조회
    List<UserPetResponse> findMyPets(Long userId);

    // 단건 조회
    UserPetResponse findMyPet(Long userId, Long PetId);

    // 작성
    UserPetResponse create(Long userId, PetCreateRequest request);

    // 수정
    UserPetResponse update(Long userId, Long petId, PetUpdateRequest request);

    // 삭제
    void delete(Long userId, Long petId);


}
