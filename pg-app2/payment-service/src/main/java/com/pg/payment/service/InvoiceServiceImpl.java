

package com.pg.payment.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.pg.payment.dto.InvoiceDto;
import com.pg.payment.dto.PaymentDto;
import com.pg.payment.entity.Invoice;
import com.pg.payment.repository.InvoiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

	private final InvoiceRepository invoiceRepository;

	/*
	 * ========================================================= 1️⃣ GENERATE
	 * INVOICE PDF =========================================================
	 */
	@Override
	public ByteArrayInputStream generateInvoice(PaymentDto payment) {
		try {
			Document document = new Document();
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			PdfWriter.getInstance(document, out);
			document.open();

			Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
			Paragraph title = new Paragraph("AK Men's PG Payment Invoice", titleFont);
			title.setAlignment(Element.ALIGN_CENTER);
			document.add(title);
			document.add(Chunk.NEWLINE);

			document.add(new Paragraph("Payment ID: " + payment.getPaymentId()));
			document.add(new Paragraph("User ID: " + payment.getUserId()));
			document.add(new Paragraph("Amount: ₹" + payment.getAmount()));
			document.add(new Paragraph("Payment Method: " + payment.getPaymentMethod()));

			String formattedDate = payment.getPaymentDate() != null
					? payment.getPaymentDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))
					: "N/A";

			document.add(new Paragraph("Payment Date: " + formattedDate));

			document.close();
			return new ByteArrayInputStream(out.toByteArray());

		} catch (Exception e) {
			throw new RuntimeException("❌ Error generating invoice PDF", e);
		}
	}

	/*
	 * ========================================================= 2️⃣ SAVE INVOICE
	 * =========================================================
	 * 
	 * @Override public Invoice saveInvoice( Long paymentId, ByteArrayInputStream
	 * pdfStream, String fileName) {
	 * 
	 * try { byte[] pdfBytes = pdfStream.readAllBytes();
	 * 
	 * Invoice invoice = Invoice.builder() .paymentId(paymentId) .fileName(fileName)
	 * .pdfData(pdfBytes) .build();
	 * 
	 * return invoiceRepository.save(invoice);
	 * 
	 * } catch (Exception e) { throw new RuntimeException("❌ Error saving invoice",
	 * e); } }
	 */

	/*
	 * ========================================================= 3️⃣ GET INVOICE BY
	 * PAYMENT ID (OLD – KEEP)
	 * =========================================================
	 */
	@Override
	public Invoice getInvoiceByPaymentId(Long paymentId) {
		return invoiceRepository.findByPaymentId(paymentId);
	}

	/*
	 * ========================================================= 🔥 4️⃣ GET INVOICE
	 * BY INVOICE ID (NEW) =========================================================
	 */
	@Override
	public Invoice getInvoiceById(Long invoiceId) {
		return invoiceRepository.findById(invoiceId)
				.orElseThrow(() -> new RuntimeException("Invoice not found with id: " + invoiceId));
	}

	/*
	 * ========================================================= 🔥 5️⃣ LIST ALL
	 * INVOICES BY USER ID (NEW)
	 * =========================================================
	 * 
	 * @Override public List<InvoiceDto> getInvoicesByUserId(Long userId) {
	 * 
	 * return invoiceRepository.findInvoicesByUserId(userId) .stream() .map(inv -> {
	 * InvoiceDto dto = new InvoiceDto(); dto.setInvoiceId(inv.getInvoiceId());
	 * dto.setPaymentId(inv.getPaymentId()); //
	 * dto.setInvoiceDate(inv.getCreatedAt().toLocalDate()); return dto; })
	 * .collect(Collectors.toList()); }
	 * 
	 */
	

	/*@Override
	public List<InvoiceDto> getInvoicesByUserId(Long userId) {

		return invoiceRepository.findInvoicesByUserId(userId).stream().map(inv -> {
			InvoiceDto dto = new InvoiceDto();
			dto.setInvoiceId(inv.getInvoiceId());
			dto.setPaymentId(inv.getPaymentId());

			// ✅ THIS IS THE IMPORTANT FIX
			dto.setInvoiceDate(inv.getCreatedAt() != null ? inv.getCreatedAt().toLocalDate() : null);

			return dto;
		}).toList();
	}*/

	@Override
	public Invoice saveInvoice(Long paymentId, ByteArrayInputStream pdfStream, String fileName) {

		// ✅ PREVENT DUPLICATE SAVE
		Invoice existing = invoiceRepository.findByPaymentId(paymentId);
		if (existing != null) {
			return existing; // already stored → just return
		}

		try {
			byte[] pdfBytes = pdfStream.readAllBytes();

			Invoice invoice = Invoice.builder().paymentId(paymentId).fileName(fileName).pdfData(pdfBytes).build();

			return invoiceRepository.save(invoice);

		} catch (Exception e) {
			throw new RuntimeException("❌ Error saving invoice", e);
		}
	}
	
	
	@Override
	public List<InvoiceDto> getInvoicesByUserId(Long userId) {

	    return invoiceRepository.findInvoicesByUserId(userId)
	            .stream()
	            // 🔒 REMOVE DUPLICATE DATES
	            .collect(Collectors.toMap(
	                inv -> inv.getCreatedAt().toLocalDate(), // key = date
	                inv -> inv,                              // value = invoice
	                (oldVal, newVal) -> oldVal               // keep first
	            ))
	            .values()
	            .stream()
	            .map(inv -> {
	                InvoiceDto dto = new InvoiceDto();
	                dto.setInvoiceId(inv.getInvoiceId());
	                dto.setPaymentId(inv.getPaymentId());
	                dto.setInvoiceDate(inv.getCreatedAt().toLocalDate());
	                return dto;
	            })
	            .sorted((a, b) -> b.getInvoiceDate().compareTo(a.getInvoiceDate()))
	            .toList();
	}

	
	
	
	
	
	
	
	
	

}
