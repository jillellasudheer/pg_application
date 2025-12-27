package com.pg.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
	private String adminName;
	private String password;
	// private Role role; // added role field

	private String role; // Accepts "ADMIN" or "MANAGER"
}
