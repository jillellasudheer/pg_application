
package com.pg.payment.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.pg.payment.dto.PaymentDto;

public class InvoiceGenerator {

	public static ByteArrayInputStream generateInvoice(PaymentDto payment) {

		Document document = new Document(PageSize.A4, 40, 40, 40, 40);
		ByteArrayOutputStream out = new ByteArrayOutputStream();

		try {
			PdfWriter.getInstance(document, out);
			document.open();

			Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
			Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
			Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 11);
			Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);

			// ===== HEADER =====
			Paragraph title = new Paragraph("AK Men's PG-Hostel", titleFont);
			title.setAlignment(Element.ALIGN_CENTER);
			document.add(title);

			Paragraph sub = new Paragraph("Monthly Payment Invoice \n", bodyFont);

			sub.setAlignment(Element.ALIGN_CENTER);
			document.add(sub);
			document.add(new Paragraph(" "));

			document.add(new LineSeparator());
			document.add(new Paragraph(" "));

			// ===== INVOICE INFO =====
			PdfPTable info = new PdfPTable(2);
			info.setWidthPercentage(100);

			info.addCell(noBorder("Invoice No: P00" + payment.getPaymentId(), bodyFont));
			info.addCell(noBorder(
					"Date: " + payment.getPaymentDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")),
					bodyFont, Element.ALIGN_RIGHT));

			document.add(info);
			document.add(new Paragraph(" "));

			// ===== USER DETAILS =====
			PdfPTable user = new PdfPTable(2);
			user.setWidthPercentage(100);
			user.setSpacingAfter(10);

			addRow(user, "User ID", String.valueOf(payment.getUserId()), headerFont, bodyFont);
			addRow(user, "User Name", payment.getUserName(), headerFont, bodyFont);
			addRow(user, "Payment Method", payment.getPaymentMethod(), headerFont, bodyFont);

			document.add(user);

			// ===== AMOUNT TABLE =====
			PdfPTable amt = new PdfPTable(2);
			amt.setWidthPercentage(60);
			amt.setHorizontalAlignment(Element.ALIGN_RIGHT);

			amt.addCell(header("Description"));
			amt.addCell(header("Amount"));

			amt.addCell(cell("Monthly Rent"));
			amt.addCell(cell("₹ " + payment.getRentAmount()));

			amt.addCell(cell("Electricity Bill"));
			amt.addCell(cell("₹ " + payment.getEbillAmount()));

			amt.addCell(total("TOTAL"));
			amt.addCell(total("₹ " + payment.getAmount()));

			document.add(amt);

			document.add(new Paragraph("\n"));
			document.add(new LineSeparator());

			Paragraph footer = new Paragraph(
					"This is a system generated invoice.\nThank you for staying with AK Men's PG-Hostel.", bodyFont);
			footer.setAlignment(Element.ALIGN_CENTER);
			document.add(footer);

			document.close();

		} catch (Exception e) {
			throw new RuntimeException("Invoice generation failed", e);
		}

		return new ByteArrayInputStream(out.toByteArray());
	}

	// ===== HELPERS =====
	private static PdfPCell noBorder(String text, Font font) {
		PdfPCell c = new PdfPCell(new Phrase(text, font));
		c.setBorder(Rectangle.NO_BORDER);
		return c;
	}

	private static PdfPCell noBorder(String text, Font font, int align) {
		PdfPCell c = noBorder(text, font);
		c.setHorizontalAlignment(align);
		return c;
	}

	private static void addRow(PdfPTable t, String k, String v, Font kf, Font vf) {
		PdfPCell c1 = new PdfPCell(new Phrase(k, kf));
		c1.setPadding(8);
		t.addCell(c1);

		PdfPCell c2 = new PdfPCell(new Phrase(v, vf));
		c2.setPadding(8);
		t.addCell(c2);
	}

	private static PdfPCell header(String text) {
		PdfPCell c = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
		c.setPadding(8);
		c.setBackgroundColor(BaseColor.LIGHT_GRAY);
		return c;
	}

	private static PdfPCell cell(String text) {
		PdfPCell c = new PdfPCell(new Phrase(text));
		c.setPadding(8);
		return c;
	}

	private static PdfPCell total(String text) {
		PdfPCell c = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
		c.setPadding(10);
		return c;
	}
}
