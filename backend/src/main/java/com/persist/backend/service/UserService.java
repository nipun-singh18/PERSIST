package com.persist.backend.service;

import com.persist.backend.dto.UserResponse;
import com.persist.backend.model.User;
import com.persist.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }
}