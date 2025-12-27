

package com.pg.admin.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pg.admin.dto.UserDto;
import com.pg.admin.entity.User;
import com.pg.admin.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ============================
    // ENTITY → DTO
    // ============================
    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .userRoom(user.getUserRoom())
                .userAadhar(user.getUserAadhar())
                .userPlace(user.getUserPlace())
                .userMobile(user.getUserMobile())
                .userMonthlyRent(user.getUserMonthlyRent())
                .userEbill(user.getUserEbill())
                .build();
        // ❌ DO NOT send password to frontend
    }

    // ============================
    // DTO → ENTITY
    // ============================
    private User mapToEntity(UserDto dto) {
        return User.builder()
                .userName(dto.getUserName())
                .userRoom(dto.getUserRoom())
                .userAadhar(dto.getUserAadhar())
                .userPlace(dto.getUserPlace())
                .userMobile(dto.getUserMobile())
                .userMonthlyRent(dto.getUserMonthlyRent())
                .userEbill(dto.getUserEbill())
                .build();
        // ❌ userId NOT set (auto-generated)
    }

    // ============================
    // CREATE USER (ADMIN)
    // ============================
    @Override
    public UserDto createUser(UserDto userDto) {
        User user = mapToEntity(userDto);

        // ✅ ENCODE PASSWORD
        user.setUserPassword(
                passwordEncoder.encode(userDto.getUserPassword())
        );

        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }

    // ============================
    // GET USER BY ID
    // ============================
    @Override
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return mapToDto(user);
    }

    // ============================
    // UPDATE USER (NO PASSWORD)
    // ============================
    @Override
    public UserDto updateUser(Long userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setUserName(userDto.getUserName());
        user.setUserRoom(userDto.getUserRoom());
        user.setUserAadhar(userDto.getUserAadhar());
        user.setUserPlace(userDto.getUserPlace());
        user.setUserMobile(userDto.getUserMobile());
        user.setUserMonthlyRent(userDto.getUserMonthlyRent());
        user.setUserEbill(userDto.getUserEbill());

        return mapToDto(userRepository.save(user));
    }

    // ============================
    // DELETE USER
    // ============================
    @Override
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }

    // ============================
    // GET ALL USERS
    // ============================
    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ============================
    // GET USER BY MOBILE
    // ============================
    @Override
    public UserDto getUserByMobile(String mobile) {
        User user = userRepository.findByUserMobile(mobile)
                .orElseThrow(() -> new RuntimeException("User not found with mobile: " + mobile));

        return mapToDto(user);
    }

    // ============================
    // UPDATE ELECTRICITY BILL ONLY
    // ============================
    @Override
    public UserDto updateUserEbill(Long userId, Double ebill) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setUserEbill(ebill);
        return mapToDto(userRepository.save(user));
    }
}

