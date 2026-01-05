package com.example.backend.service.impl;

import com.example.backend.domain.Pet;
import com.example.backend.domain.User;
import com.example.backend.dto.request.MyPage.PetCreateRequest;
import com.example.backend.dto.request.MyPage.PetUpdateRequest;
import com.example.backend.dto.response.UserPetResponse;
import com.example.backend.repository.UserPetRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserPetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserPetServiceImpl implements UserPetService {

    private final UserPetRepository userPetRepository;
    private final UserRepository userRepository;

    // 등록
    @Override
    public UserPetResponse create(Long userId, PetCreateRequest request){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        Pet pet = request.toEntity(user);
        Pet saved = userPetRepository.save(pet);

        return UserPetResponse.from(saved);
    }

    // 수정
    @Override
    public UserPetResponse update(Long userId, Long petId, PetUpdateRequest request) {
        Pet pet = userPetRepository.findByPetIdAndUserId(petId, userId)
                .orElseThrow(() -> new IllegalArgumentException("반려동물 없음"));

        pet.update(
                request.getName(),
                request.getSpecies(),
                request.getBreed(),
                request.getGender(),
                request.getWeight(),
                request.getImageUrl()
                );

        return UserPetResponse.from(pet);
    }

    // 삭제
    @Override
    public void delete(Long userId, Long petId) {
        Pet pet = userPetRepository.findByPetIdAndUserId(petId, userId)
                .orElseThrow(() -> new IllegalArgumentException("반려동물 없음"));
        userPetRepository.delete(pet);
    }

    // 조회
    @Override
    @Transactional(readOnly = true)
    public List<UserPetResponse> findMyPets(Long userId) {
        return userPetRepository.findByUserId(userId)
                .stream()
                .map(UserPetResponse::from)
                .toList();
    }
}
