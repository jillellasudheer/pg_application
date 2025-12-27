package com.pg.admin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pg.admin.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	// Optional<User> findByUserMobile(String mobile);
	Optional<User> findByUserMobile(String userMobile);

}
