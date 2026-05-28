package cars.microservices.ChatMicroservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationDTO {
    private Long id;
    private Long adId;
    private String buyerEmail;
    private String sellerEmail;
    private String adTitle;
    private LocalDateTime createdAt;
}