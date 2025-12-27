package com.pg.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceDataDto {

	private String invoiceNumber;
	private Long userId;
	private String userName;
	private Double totalAmount;
}
