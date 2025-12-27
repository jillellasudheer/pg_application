package com.pg.admin.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pg.admin.dto.AdminDto;
import com.pg.admin.dto.LoginRequest;
import com.pg.admin.dto.LoginResponse;
import com.pg.admin.entity.Admin;
import com.pg.admin.entity.Role;
import com.pg.admin.repository.AdminRepository;
import com.pg.admin.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

	private final AdminRepository adminRepository;
	private final JwtUtil jwtUtil;
	private final PasswordEncoder passwordEncoder;

	@Override
	@Transactional
	public AdminDto register(AdminDto dto, String rawPassword) {
		// Check if admin already exists
		if (adminRepository.findByAdminName(dto.getAdminName()).isPresent()) {
			throw new RuntimeException("Admin with this name already exists");
		}

		// Default role = ADMIN if not provided
		Role role = dto.getRole() != null ? dto.getRole() : Role.ADMIN;

		Admin admin = Admin.builder().adminName(dto.getAdminName()).password(passwordEncoder.encode(rawPassword)) // secure
																													// hash
				.role(role).build();

		Admin saved = adminRepository.save(admin);
		return toDto(saved);
	}

	@Override
	public LoginResponse login(LoginRequest request) {
		Admin admin = adminRepository.findByAdminName(request.getAdminName())
				.orElseThrow(() -> new RuntimeException("Admin not found"));

		if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
			throw new RuntimeException("Invalid credentials");
		}

		// Generate token (can include role if needed for RBAC)
		String token = jwtUtil.generateToken(admin.getAdminName());

		return new LoginResponse(token, toDto(admin));
	}

	@Override
	public AdminDto getAdminDetails(String username) {
		Admin admin = adminRepository.findByAdminName(username)
				.orElseThrow(() -> new RuntimeException("Admin not found"));

		return toDto(admin);
	}

	// 🔹 Utility method to avoid repetition
	private AdminDto toDto(Admin admin) {
		return AdminDto.builder().adminId(admin.getAdminId()).adminName(admin.getAdminName()).role(admin.getRole())
				.build();
	}

	@Override
	public void deleteAdmin(Long adminId) {
		if (!adminRepository.existsById(adminId)) {
			throw new RuntimeException("Admin with ID " + adminId + " not found");
		}
		adminRepository.deleteById(adminId);
	}
}
