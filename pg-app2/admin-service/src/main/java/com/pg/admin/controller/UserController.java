package com.pg.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pg.admin.dto.UserDto;
import com.pg.admin.feign.PaymentClient;
import com.pg.admin.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	private final PaymentClient paymentClient; // ✅ ADD THIS

	// ✅ Create a new user
	@PostMapping
	public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
		return ResponseEntity.ok(userService.createUser(userDto));
	}

	// ✅ Get a user by ID
	@GetMapping("/{id}")
	public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
		return ResponseEntity.ok(userService.getUserById(id));
	}

	// ✅ Update a user
	@PutMapping("/{id}")
	public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
		return ResponseEntity.ok(userService.updateUser(id, userDto));
	}

	// ✅ Delete a user
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
		userService.deleteUser(id);
		return ResponseEntity.noContent().build();
	}

	// ✅ Get all users
	@GetMapping
	public ResponseEntity<List<UserDto>> getAllUsers() {
		return ResponseEntity.ok(userService.getAllUsers());
	}

	// ✅ Get user by mobile
	@GetMapping("/mobile/{mobile}")
	public ResponseEntity<UserDto> getUserByMobile(@PathVariable String mobile) {
		return ResponseEntity.ok(userService.getUserByMobile(mobile));
	}

	// ✅ Update electricity bill only
	/*
	 * @PatchMapping("/{id}/ebill") public ResponseEntity<UserDto>
	 * updateUserEbill(@PathVariable Long id, @RequestParam Double ebill) { return
	 * ResponseEntity.ok(userService.updateUserEbill(id, ebill)); }
	 */

	@PatchMapping("/{id}/ebill")
	public ResponseEntity<UserDto> updateUserEbill(@PathVariable Long id, @RequestParam Double ebill) {

		// 1️⃣ Update electricity bill
		UserDto updatedUser = userService.updateUserEbill(id, ebill);

		// 2️⃣ 🔥 RESET PAYMENT STATUS TO DUE
		paymentClient.resetPaymentStatus(id);

		return ResponseEntity.ok(updatedUser);
	}

	// ✅ Get allocated rooms
	@GetMapping("/rooms")
	public ResponseEntity<List<String>> getAllocatedRooms() {
		List<String> allocatedRooms = userService.getAllUsers().stream().map(UserDto::getUserRoom).toList();
		return ResponseEntity.ok(allocatedRooms);
	}
}


