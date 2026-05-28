package cars.microservices.ChatMicroservice.controllers;

import cars.microservices.ChatMicroservice.dtos.MessageDTO;
import cars.microservices.ChatMicroservice.dtos.SendMessageDTO;
import cars.microservices.ChatMicroservice.models.Conversation;
import cars.microservices.ChatMicroservice.repositories.ConversationRepository;
import cars.microservices.ChatMicroservice.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ConversationRepository conversationRepository;

    @MessageMapping("/chat.send")
    public void handleMessage(SendMessageDTO dto, Principal principal) {
        String senderEmail = principal.getName();
        MessageDTO saved = chatService.saveMessage(senderEmail, dto);

        Conversation conv = conversationRepository.findById(dto.getConversationId())
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        messagingTemplate.convertAndSendToUser(
                conv.getBuyerEmail(), "/queue/messages", saved);
        messagingTemplate.convertAndSendToUser(
                conv.getSellerEmail(), "/queue/messages", saved);
    }
}