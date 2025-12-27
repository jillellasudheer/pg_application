package com.pg.payment.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.pg.payment.dto.UserDto;

@FeignClient(name = "user-service", url = "http://localhost:8081/api/admin")
public interface AdminClient {

	@GetMapping("/users/{id}")
	UserDto getUserById(@PathVariable("id") Long id);
}
