
package com.pg.payment.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "invoices",
uniqueConstraints = {
        @UniqueConstraint(columnNames = "paymentId")
    }
)
@Data
@Builder
@NoArgsConstructor // ✅ REQUIRED
@AllArgsConstructor
public class Invoice {
	@Id
	@GeneratedValue
	private Long invoiceId;
	private Long paymentId;
	private String fileName;

	@Lob
	private byte[] pdfData;
	
	
	
	// extra
	@CreationTimestamp
	private LocalDateTime createdAt;
}
