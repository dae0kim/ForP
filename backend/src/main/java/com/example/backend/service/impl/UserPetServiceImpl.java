package com.example.backend.service.impl;

import com.example.backend.domain.Pet;
import com.example.backend.domain.User;
import com.example.backend.dto.request.MyPage.PetCreateRequest;
import com.example.backend.dto.request.MyPage.PetUpdateRequest;
import com.example.backend.dto.response.UserPetResponse;
import com.example.backend.repository.UserPetRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.FileService;
import com.example.backend.service.UserPetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserPetServiceImpl implements UserPetService {

    private final UserPetRepository userPetRepository;
    private final UserRepository userRepository;
    private final FileService fileService;

    // 등록
    @Override
    public UserPetResponse create(Long userId, PetCreateRequest request){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        Pet pet = request.toEntity(user);
        Pet saved = userPetRepository.save(pet);

        return UserPetResponse.from(saved);
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

    // 단건 조회
    @Override
    @Transactional(readOnly = true)
    public UserPetResponse findMyPet(Long userId, Long petId) {
        Pet pet = userPetRepository.findByPetIdAndUserId(petId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found"));
        return UserPetResponse.from(pet);
    }

    // 수정
    @Override
    @Transactional
    public UserPetResponse update(Long userId, Long petId, PetUpdateRequest request) {
        Pet pet = userPetRepository.findByPetIdAndUserId(petId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet with id " + petId + " not found"));

        String oldUrl = pet.getImageUrl();
        String newUrl = request.getImageUrl();

        // 이미지가 바뀐 경우에만 기존 파일 삭제
        if (newUrl != null && !newUrl.isBlank() && !newUrl.equals(oldUrl)) {
            fileService.deleteImage(oldUrl);
        }

        pet.update(
                request.getName(),
                request.getSpecies(),
                request.getBreed(),
                request.getGender(),
                request.getWeight(),
                (newUrl == null || newUrl.isBlank()) ? oldUrl : newUrl
        );

        return UserPetResponse.from(pet);
    }
    
    // 삭제
    @Override
    public void delete(Long userId, Long petId) {
        Pet pet = userPetRepository.findByPetIdAndUserId(petId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "반려동물 찾을 수 없음"));

        if (!pet.getUser().getId().equals(userId)) {
            throw new RuntimeException("반려동물 없음");
        }

        // 파일 삭제
        fileService.deleteImage(pet.getImageUrl());

        // DB 삭제
        userPetRepository.delete(pet);
    }

}
