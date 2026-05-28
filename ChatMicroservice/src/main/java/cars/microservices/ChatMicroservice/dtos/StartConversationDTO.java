package cars.microservices.ChatMicroservice.dtos;

import lombok.Data;

@Data
public class StartConversationDTO {
    private Long adId;
    private String sellerEmail;
    private String adTitle;
}