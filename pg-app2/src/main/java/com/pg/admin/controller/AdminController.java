
package com.pg.admin.controller;

import com.pg.admin.entity.Admin;
import com.pg.admin.security.JwtUtil;
import com.pg.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Admin> register(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.register(admin));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Admin admin) {
        return adminService.login(admin.getAdminName(), admin.getPassword())
                .map(a -> ResponseEntity.ok(jwtUtil.generateToken(a.getAdminName())))
                .orElse(ResponseEntity.status(401).body("Invalid credentials"));
    }

    @GetMapping("/me")
    public ResponseEntity<Admin> getAdminDetails(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        return ResponseEntity.ok(adminService.getAdminDetails(username));
    }

    @PostMapping("/update-bill")
    public ResponseEntity<String> updateBill(@RequestParam String room, @RequestParam double totalBill) {
        double perPerson = totalBill / 4;
        return ResponseEntity.ok("Bill updated for room " + room + ", per person: " + perPerson);
    }
}
