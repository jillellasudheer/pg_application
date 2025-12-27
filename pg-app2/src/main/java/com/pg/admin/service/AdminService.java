
package com.pg.admin.service;

import com.pg.admin.entity.Admin;
import com.pg.admin.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public Admin register(Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }

    public Optional<Admin> login(String username, String password) {
        Optional<Admin> adminOpt = adminRepository.findByAdminName(username);
        if (adminOpt.isPresent() && passwordEncoder.matches(password, adminOpt.get().getPassword())) {
            return adminOpt;
        }
        return Optional.empty();
    }

    public Admin getAdminDetails(String username) {
        return adminRepository.findByAdminName(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }
}
