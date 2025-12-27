package com.pg.user.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.pg.user.dto.UserDto;

@FeignClient(name = "admin-service", url = "http://localhost:8081")
public interface AdminClient {

	@GetMapping("/users/{id}")
	UserDto getUserById(@PathVariable("id") Long id);
}
