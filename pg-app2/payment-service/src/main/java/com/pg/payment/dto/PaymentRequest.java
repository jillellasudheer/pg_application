package com.pg.payment.dto;

import lombok.Data;

@Data
public class PaymentRequest {
	private Long userId;
	private Double amount;
	private String mode;
}
