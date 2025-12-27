package com.pg.admin.service;
import java.util.List;

import com.pg.admin.dto.UserDto;

public interface UserService {

	UserDto createUser(UserDto userDto);

	UserDto getUserById(Long userId);

	List<UserDto> getAllUsers();

	UserDto updateUser(Long userId, UserDto dto);

	void deleteUser(Long userId);

	UserDto getUserByMobile(String mobile);

	UserDto updateUserEbill(Long id, Double ebill);



}


