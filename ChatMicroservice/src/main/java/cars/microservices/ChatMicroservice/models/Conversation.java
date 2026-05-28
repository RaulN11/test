package cars.microservices.ChatMicroservice.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "conversations",
        uniqueConstraints = @UniqueConstraint(columnNames = {"ad_id", "buyer_email"}))
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ad_id", nullable = false)
    private Long adId;

    @Column(name = "buyer_email", nullable = false)
    private String buyerEmail;

    @Column(name = "seller_email", nullable = false)
    private String sellerEmail;

    @Column(name = "ad_title")
    private String adTitle;   // e.g. "Toyota Corolla" — stored for display

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}