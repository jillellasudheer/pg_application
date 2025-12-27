package com.pg.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;

	@Column(nullable = false)
	private String userName;

	@Column(nullable = false)
	private String userPassword;

	@Column(nullable = false)
	private String userRoom;

	private String userAadhar; // optional

	@Column(nullable = false)
	private String userPlace;

	private String userMobile; // ✅ added

	@Column(nullable = false)
	private Double userMonthlyRent;

	@Column(nullable = false)
	private Double userEbill;

}

////
////
////
////package com.pg.user.entity;
////
////import jakarta.persistence.Entity;
////import jakarta.persistence.GeneratedValue;
////import jakarta.persistence.GenerationType;
////import jakarta.persistence.Id;
////import lombok.Data;
////
////@Entity
////
////@Data
////public class User {
////   // @Id @GeneratedValue
////    @Id
////    @GeneratedValue(strategy = GenerationType.IDENTITY)
////    private Long userId;
////    private String userName;
////    private String userPassword;
////    private String userRoom;
////    private String userMobile;
////    private Double userMonthlyRent;
////    private Double userEbill;
////    private String userPlace;
////    
////    
////
////    
////}
//
//
//
//
//
//
//package com.pg.user.entity;
//
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.Table;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//@Entity
//@Table(name = "users")
//@Getter @Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class User {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long userId;
//
//    private String userName;
//    private String userPassword;
//
//    private String userRoom;
//    private String userMobile;
//    private Double userMonthlyRent;
//    private Double userEbill;
//}
//
