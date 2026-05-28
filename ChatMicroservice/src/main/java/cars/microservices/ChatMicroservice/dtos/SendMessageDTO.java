package cars.microservices.ChatMicroservice.dtos;

import lombok.Data;

@Data
public class SendMessageDTO {
    private Long conversationId;
    private String content;
}