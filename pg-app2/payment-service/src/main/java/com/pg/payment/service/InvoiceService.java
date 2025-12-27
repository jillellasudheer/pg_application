package com.pg.payment.service;

import java.io.ByteArrayInputStream;
import java.util.List;

import com.pg.payment.dto.InvoiceDto;
import com.pg.payment.dto.PaymentDto;
import com.pg.payment.entity.Invoice;

public interface InvoiceService {
	ByteArrayInputStream generateInvoice(PaymentDto payment);

	Invoice saveInvoice(Long paymentId, ByteArrayInputStream pdfStream, String fileName);

	Invoice getInvoiceByPaymentId(Long paymentId);
	// Invoice getInvoiceByPaymentId(Long paymentId);
	
	
	
	
	
	
	List<InvoiceDto> getInvoicesByUserId(Long userId);

	Invoice getInvoiceById(Long invoiceId);


}
