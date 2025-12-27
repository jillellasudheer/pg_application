
package com.pg.payment.service;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pg.payment.dto.InvoiceDataDto;
import com.pg.payment.dto.PaymentDto;
import com.pg.payment.dto.UserDto;
import com.pg.payment.entity.Payment;
import com.pg.payment.feign.AdminClient;
import com.pg.payment.repository.PaymentRepository;
import com.pg.payment.util.PdfInvoiceExtractor;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

	private final PaymentRepository paymentRepository;
	private final AdminClient adminClient;

	/*
	 * ========================================================= 1️⃣ CREATE PAYMENT
	 * → STATUS = DUE =========================================================
	 */
	@Override
	public PaymentDto createPayment(Long userId, String method) {

		UserDto user = adminClient.getUserById(userId);
		if (user == null) {
			throw new RuntimeException("User not found: " + userId);
		}

		double rent = user.getUserMonthlyRent() != null ? user.getUserMonthlyRent() : 0.0;
		double ebill = user.getUserEbill() != null ? user.getUserEbill() : 0.0;
		double total = rent + ebill;

		Payment payment = Payment.builder().userId(userId).userName(user.getUserName()).amount(total)
				.paymentMethod(method).paymentDate(LocalDateTime.now()).status("DUE").build();

		Payment saved = paymentRepository.save(payment);

		return PaymentDto.builder().paymentId(saved.getPaymentId()).userId(saved.getUserId())
				.userName(saved.getUserName()).rentAmount(rent).ebillAmount(ebill).amount(total)
				.paymentMethod(saved.getPaymentMethod()).paymentDate(saved.getPaymentDate()).status(saved.getStatus())
				.build();
	}

	/*
	 * ========================================================= 2️⃣ UPDATE STATUS
	 * (STRICT FLOW) =========================================================
	 */
	@Override
	public void updateStatus(Long paymentId, String newStatus) {

		Payment payment = paymentRepository.findById(paymentId)
				.orElseThrow(() -> new RuntimeException("Payment not found"));

		String current = payment.getStatus();

		if ("DUE".equals(current) && "INVOICE_UPLOADED".equals(newStatus)) {
			payment.setStatus("INVOICE_UPLOADED");

		} else if ("INVOICE_UPLOADED".equals(current) && "PAID".equals(newStatus)) {
			payment.setStatus("PAID");

		} else {
			throw new RuntimeException("Invalid status transition: " + current + " → " + newStatus);
		}

		paymentRepository.save(payment);
	}

	/*
	 * ========================================================= 3️⃣ GET LATEST
	 * STATUS =========================================================
	 */
	@Override
	public String getStatus(Long userId) {
		return paymentRepository.findTopByUserIdOrderByPaymentDateDesc(userId).map(Payment::getStatus).orElse("DUE");
	}

	/*
	 * ========================================================= 4️⃣ RESET TO DUE
	 * (EBILL CHANGE) =========================================================
	 */
	@Override
	public void resetLatestPaymentToDue(Long userId) {

		Payment payment = paymentRepository.findTopByUserIdOrderByPaymentDateDesc(userId).orElse(null);

		if (payment == null)
			return;

		payment.setStatus("DUE");
		paymentRepository.save(payment);
	}

	/*
	 * ========================================================= 5️⃣ GET LATEST
	 * PAYMENT =========================================================
	 */
	@Override
	public PaymentDto getLatestPaymentByUserId(Long userId) {

		Payment payment = paymentRepository.findTopByUserIdOrderByPaymentDateDesc(userId)
				.orElseThrow(() -> new RuntimeException("No payment found"));

		return PaymentDto.builder().paymentId(payment.getPaymentId()).userId(payment.getUserId())
				.userName(payment.getUserName()).amount(payment.getAmount()).status(payment.getStatus())
				.paymentMethod(payment.getPaymentMethod()).paymentDate(payment.getPaymentDate()).build();
	}

	/*
	 * ========================================================= 6️⃣ UPLOAD + VERIFY
	 * INVOICE =========================================================
	 */
	@Override
	public void uploadInvoice(Long paymentId, MultipartFile file) {

		if (file == null || file.isEmpty()) {
			throw new RuntimeException("Invoice file is required");
		}

		Payment payment = paymentRepository.findById(paymentId)
				.orElseThrow(() -> new RuntimeException("Payment not found"));

		InvoiceDataDto invoice;
		try {
			invoice = PdfInvoiceExtractor.extract(file.getInputStream());
		} catch (IOException e) {
			throw new RuntimeException("Failed to read invoice PDF", e);
		}

		if (invoice == null) {
			throw new RuntimeException("Invoice extraction failed");
		}

		// ✅ Validate user
		if (!invoice.getUserId().equals(payment.getUserId())) {
			throw new RuntimeException("Invoice userId mismatch");
		}

		// ✅ Validate amount (safe comparison)
		double expected = payment.getAmount();
		double actual = invoice.getTotalAmount();

		if (Math.abs(expected - actual) > 0.01) {
			throw new RuntimeException("Invoice total mismatch. Expected " + expected + " but found " + actual);
		}

		// ✅ Status update
		updateStatus(paymentId, "INVOICE_UPLOADED");

		System.out.println("✅ Invoice verified successfully");
	}
}
