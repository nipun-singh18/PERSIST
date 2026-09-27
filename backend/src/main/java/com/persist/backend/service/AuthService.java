package com.persist.backend.service;

import com.persist.backend.dto.LoginRequest;
import com.persist.backend.dto.RegisterRequest;
import com.persist.backend.dto.UserResponse;
import com.persist.backend.model.User;
import com.persist.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse register(RegisterRequest request) {

        boolean emailTaken = userRepository.findAll().stream()
                .anyMatch(u -> u.getEmail().equalsIgnoreCase(request.getEmail()));

        if (emailTaken) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        User saved = userRepository.save(user);

        return new UserResponse(saved.getId(), saved.getName(), saved.getEmail());
    }

    public UserResponse login(LoginRequest request) {

        User user = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(request.getEmail()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No account found with this email."));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Incorrect password.");
        }

        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }
}