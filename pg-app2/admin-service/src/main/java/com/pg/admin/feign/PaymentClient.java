package com.pg.admin.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "payment-service", url = "http://localhost:8083")
public interface PaymentClient {

	@PostMapping("/api/payments/reset/{userId}")
	void resetPaymentStatus(@PathVariable Long userId);

	@GetMapping("/api/payments/status/{userId}")
	String getPaymentStatus(@PathVariable Long userId);
}
