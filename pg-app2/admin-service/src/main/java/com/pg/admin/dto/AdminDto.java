package com.pg.admin.dto;


import com.pg.admin.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminDto {
    private Long adminId;
    private String adminName;
    private Role role;  // added role
}







