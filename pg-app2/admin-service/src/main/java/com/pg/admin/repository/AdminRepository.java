package com.pg.admin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pg.admin.entity.Admin;
import com.pg.admin.entity.User;

public interface AdminRepository extends JpaRepository<Admin, Long> {
	Optional<Admin> findByAdminName(String adminName);

}
