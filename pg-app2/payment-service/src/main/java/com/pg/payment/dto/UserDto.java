package com.pg.payment.dto;

import lombok.Data;

@Data
public class UserDto {
	private Long userId;
	private String userName;
	private Double userMonthlyRent;
	private Double userEbill;
}
