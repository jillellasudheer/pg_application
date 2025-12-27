package com.pg.admin.service;

import com.pg.admin.dto.AdminDto;
import com.pg.admin.dto.LoginRequest;
import com.pg.admin.dto.LoginResponse;

public interface AdminService {

	/**
	 * ✅ Register a new admin - Takes an AdminDto (which includes role) and raw
	 * password
	 */
	AdminDto register(AdminDto dto, String rawPassword);

	/**
	 * ✅ Authenticate admin and return JWT + admin details
	 */
	LoginResponse login(LoginRequest request);

	/**
	 * ✅ Get details of currently logged-in admin
	 */
	AdminDto getAdminDetails(String adminName);

	// Delete admin/manager by ID
	void deleteAdmin(Long adminId);

}
