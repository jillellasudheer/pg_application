
package com.pg.payment.service;

import org.springframework.web.multipart.MultipartFile;

import com.pg.payment.dto.PaymentDto;

public interface PaymentService {
	PaymentDto createPayment(Long userId, String method);

	// void markAsPaid(Long paymentId);
	String getStatus(Long userId);

	void updateStatus(Long paymentId, String status);
	// Payment getLatestPayment(Long userId);

	// void approvePayment(Long paymentId);
	void resetLatestPaymentToDue(Long userId);

	PaymentDto getLatestPaymentByUserId(Long userId);

	void uploadInvoice(Long paymentId, MultipartFile file);

}
