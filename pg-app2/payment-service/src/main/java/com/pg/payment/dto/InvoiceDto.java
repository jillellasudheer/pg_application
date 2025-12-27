package com.pg.payment.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class InvoiceDto {

    private Long invoiceId;
    private Long paymentId;
    private LocalDate invoiceDate;
}
