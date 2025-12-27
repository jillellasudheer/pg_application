//package com.pg.payment.repository;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import com.pg.payment.entity.Invoice;
//
//public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
//    Invoice findByPaymentId(Long paymentId);
//    
//    
//    
//}





package com.pg.payment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pg.payment.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    /* ===============================
       OLD – KEEP (Used in current flow)
       =============================== */
    Invoice findByPaymentId(Long paymentId);

    /* ===============================
       NEW – LIST INVOICES BY USER ID
       =============================== */
    @Query("""
        SELECT i FROM Invoice i
        JOIN Payment p ON i.paymentId = p.paymentId
        WHERE p.userId = :userId
        ORDER BY i.createdAt DESC
    """)
    List<Invoice> findInvoicesByUserId(@Param("userId") Long userId);
    


    
    
    
    
    
    
}
