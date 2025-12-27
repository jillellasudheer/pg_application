package com.pg.user.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pg.user.dto.UserDto;
import com.pg.user.entity.User;
import com.pg.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public UserDto login(String userName, String rawPassword) {
		User user = userRepository.findByUserName(userName).orElseThrow(() -> new RuntimeException("User not found"));

		if (!passwordEncoder.matches(rawPassword, user.getUserPassword())) {
			throw new RuntimeException("Invalid username or password");
		}

		// Map to DTO (manual or ModelMapper)
		UserDto dto = new UserDto();
		dto.setUserId(user.getUserId());
		dto.setUserName(user.getUserName());
		dto.setUserRoom(user.getUserRoom());
		dto.setUserAadhar(user.getUserAadhar());
		dto.setUserPlace(user.getUserPlace());
		dto.setUserMonthlyRent(user.getUserMonthlyRent());
		dto.setUserEbill(user.getUserEbill());
		dto.setUserMobile(user.getUserMobile());
		return dto;
	}
}
