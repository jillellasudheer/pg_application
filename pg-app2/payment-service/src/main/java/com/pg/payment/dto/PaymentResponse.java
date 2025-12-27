package com.pg.payment.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentResponse {
	private Long id;
	private Long userId;
	private String userName;
	private String room;
	private Double amount;
	private String mode;
	private String status;
	private LocalDateTime paymentDate;
}
