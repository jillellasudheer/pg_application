package com.pg.payment.util;

import java.io.InputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import com.pg.payment.dto.InvoiceDataDto;

public class PdfInvoiceExtractor {

	public static InvoiceDataDto extract(InputStream inputStream) {

		try (PDDocument document = PDDocument.load(inputStream)) {

			PDFTextStripper stripper = new PDFTextStripper();
			String text = stripper.getText(document);

			System.out.println("📄 Extracted PDF Text:\n" + text);

			String invoiceNo = extractValue(text, "Invoice No:\\s*(\\S+)");
			Long userId = Long.valueOf(extractValue(text, "User ID\\s*(\\d+)"));
			String userName = extractValue(text, "User Name\\s*(\\w+)");
			Double total = Double.valueOf(extractValue(text, "TOTAL\\s*(\\d+\\.\\d+)"));

			return new InvoiceDataDto(invoiceNo, userId, userName, total);

		} catch (Exception e) {
			throw new RuntimeException("Failed to extract invoice data", e);
		}
	}

	private static String extractValue(String text, String regex) {
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(text);

		if (matcher.find()) {
			return matcher.group(1);
		}
		throw new RuntimeException("Missing required field in invoice PDF");
	}
}
