package com.example.backend.repository;

import com.example.backend.domain.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserPetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByUserId(Long userId);

    Optional<Pet> findByPetIdAndUserId(Long petId, Long userId);
}
