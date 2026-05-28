package cars.microservices.ChatMicroservice.services;

import cars.microservices.ChatMicroservice.dtos.*;

import java.util.List;

public interface ChatService {
    ConversationDTO getOrCreateConversation(String buyerEmail, StartConversationDTO dto);
    List<ConversationDTO> getMyConversations(String userEmail);
    List<MessageDTO> getMessages(Long conversationId, String userEmail);
    MessageDTO saveMessage(String senderEmail, SendMessageDTO dto);
}