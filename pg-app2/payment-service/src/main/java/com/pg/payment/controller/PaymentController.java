

package com.pg.payment.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pg.payment.dto.InvoiceDto;
import com.pg.payment.dto.PaymentDto;
import com.pg.payment.entity.Invoice;
import com.pg.payment.service.InvoiceService;
import com.pg.payment.service.PaymentService;
import com.pg.payment.util.InvoiceGenerator;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;
    private final InvoiceService invoiceService;

    /* =========================================================
       1️⃣ CREATE PAYMENT + AUTO GENERATE INVOICE
       ========================================================= */
    @PostMapping("/{userId}")
    public ResponseEntity<PaymentDto> createPayment(
            @PathVariable Long userId,
            @RequestParam String method) {

        PaymentDto payment = paymentService.createPayment(userId, method);

        var pdfStream = InvoiceGenerator.generateInvoice(payment);
        invoiceService.saveInvoice(
                payment.getPaymentId(),
                pdfStream,
                "invoice-" + payment.getPaymentId() + ".pdf"
        );

        return ResponseEntity.ok(payment);
    }

    /* =========================================================
       2️⃣ DOWNLOAD INVOICE BY PAYMENT ID (OLD – KEEP)
       ========================================================= */
    @GetMapping("/{paymentId}/invoice/download")
    public ResponseEntity<byte[]> downloadInvoiceByPayment(@PathVariable Long paymentId) {

        Invoice invoice = invoiceService.getInvoiceByPaymentId(paymentId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + invoice.getFileName())
                .contentType(MediaType.APPLICATION_PDF)
                .body(invoice.getPdfData());
    }

    /* =========================================================
       3️⃣ UPLOAD INVOICE
       ========================================================= */
    @PostMapping(value = "/{paymentId}/invoice/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadInvoice(
            @PathVariable Long paymentId,
            @RequestPart("file") MultipartFile file) {

        paymentService.uploadInvoice(paymentId, file);
        return ResponseEntity.ok("INVOICE_UPLOADED");
    }

    /* =========================================================
       4️⃣ ADMIN APPROVE PAYMENT
       ========================================================= */
    @PostMapping("/{paymentId}/approve")
    public ResponseEntity<String> approvePayment(@PathVariable Long paymentId) {
        paymentService.updateStatus(paymentId, "PAID");
        return ResponseEntity.ok("PAID");
    }

    /* =========================================================
       5️⃣ GET PAYMENT STATUS BY USER
       ========================================================= */
    @GetMapping("/status/{userId}")
    public ResponseEntity<String> getStatus(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getStatus(userId));
    }

    /* =========================================================
       6️⃣ RESET PAYMENT TO DUE
       ========================================================= */
    @PostMapping("/reset/{userId}")
    public ResponseEntity<String> resetPaymentStatus(@PathVariable Long userId) {
        paymentService.resetLatestPaymentToDue(userId);
        return ResponseEntity.ok("PAYMENT_STATUS_RESET_TO_DUE");
    }

    /* =========================================================
       7️⃣ GET LATEST PAYMENT
       ========================================================= */
    @GetMapping("/latest/{userId}")
    public ResponseEntity<PaymentDto> getLatestPayment(@PathVariable Long userId) {
        return ResponseEntity.ok(
                paymentService.getLatestPaymentByUserId(userId)
        );
    }

    /* =========================================================
       🔥 8️⃣ LIST ALL INVOICES OF A USER (NEW)
       ========================================================= */
    @GetMapping("/{userId}/invoices")
    public ResponseEntity<List<InvoiceDto>> getInvoicesByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                invoiceService.getInvoicesByUserId(userId)
        );
    }

    /* =========================================================
       🔥 9️⃣ DOWNLOAD INVOICE BY INVOICE ID (NEW)
       ========================================================= */
    @GetMapping("/invoice/{invoiceId}/download")
    public ResponseEntity<byte[]> downloadInvoiceByInvoiceId(
            @PathVariable Long invoiceId) {

        Invoice invoice = invoiceService.getInvoiceById(invoiceId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + invoice.getFileName())
                .contentType(MediaType.APPLICATION_PDF)
                .body(invoice.getPdfData());
    }
}


























