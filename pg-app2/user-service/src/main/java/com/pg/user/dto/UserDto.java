package com.pg.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

	private Long userId;
	private String userName;
	private String userRoom;
	private String userMobile;
	private String userPlace;
	private String userAadhar;
	private Double userMonthlyRent;
	private Double userEbill;
}
