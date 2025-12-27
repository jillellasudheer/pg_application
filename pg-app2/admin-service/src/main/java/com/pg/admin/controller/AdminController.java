//package com.pg.admin.controller;

package com.pg.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pg.admin.dto.AdminDto;
import com.pg.admin.dto.LoginRequest;
import com.pg.admin.dto.LoginResponse;
import com.pg.admin.entity.Role;
import com.pg.admin.security.JwtUtil;
import com.pg.admin.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend
@RequiredArgsConstructor
public class AdminController {

	private final AdminService adminService;
	private final JwtUtil jwtUtil;

	/**
	 * Register a new Admin or Manager - Saves role as provided (ADMIN or MANAGER) -
	 * Both roles have same access (handled via security config)
	 */
	@PostMapping("/register")
	public ResponseEntity<AdminDto> register(@RequestBody LoginRequest request) {
		Role selectedRole;
		try {
			selectedRole = Role.valueOf(request.getRole().toUpperCase());
		} catch (IllegalArgumentException e) {
			selectedRole = Role.ADMIN; // Default role if invalid
		}

		AdminDto dto = AdminDto.builder().adminName(request.getAdminName()).role(selectedRole).build();

		AdminDto savedAdmin = adminService.register(dto, request.getPassword());
		return ResponseEntity.ok(savedAdmin);
	}

	/**
	 * Login & get JWT token
	 */
	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
		LoginResponse response = adminService.login(request);
		return ResponseEntity.ok(response);
	}

	/**
	 * Get current admin details using JWT
	 */

	@GetMapping("/me")
	public ResponseEntity<AdminDto> getAdminDetails(@RequestHeader("Authorization") String token) {
		String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
		String username = jwtUtil.extractUsername(jwtToken);
		AdminDto admin = adminService.getAdminDetails(username);
		return ResponseEntity.ok(admin);
	}

	/*
	 * @GetMapping("/me") public ResponseEntity<AdminDto>
	 * getAdminDetails(Authentication authentication) { String username =
	 * authentication.name(); AdminDto admin =
	 * adminService.getAdminDetails(username); return ResponseEntity.ok(admin); }
	 */

	/**
	 * Delete admin by ID
	 */
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {
		adminService.deleteAdmin(id);
		return ResponseEntity.ok("Admin with ID " + id + " has been deleted successfully.");
	}
}



