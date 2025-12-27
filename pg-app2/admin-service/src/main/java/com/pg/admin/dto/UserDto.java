package com.pg.admin.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long userId;
    private String userName;
    private String userRoom;
    private String userAadhar; // optional
    private String userPlace;
    private Double userMonthlyRent;
    private Double userEbill;
    
    private String userMobile;   // ✅ added
    private String userPassword;   // ✅ include password
    
   
}



