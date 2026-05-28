package cars.microservices.ChatMicroservice.services;

import cars.microservices.ChatMicroservice.dtos.*;
import cars.microservices.ChatMicroservice.models.*;
import cars.microservices.ChatMicroservice.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Override
    public ConversationDTO getOrCreateConversation(String buyerEmail, StartConversationDTO dto) {
        Conversation conv = conversationRepository
                .findByAdIdAndBuyerEmail(dto.getAdId(), buyerEmail)
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setAdId(dto.getAdId());
                    c.setBuyerEmail(buyerEmail);
                    c.setSellerEmail(dto.getSellerEmail());
                    c.setAdTitle(dto.getAdTitle());
                    return conversationRepository.save(c);
                });
        return toDTO(conv);
    }

    @Override
    public List<ConversationDTO> getMyConversations(String userEmail) {
        return conversationRepository
                .findByBuyerEmailOrSellerEmail(userEmail, userEmail)
                .stream().map(this::toDTO).toList();
    }

    @Override
    public List<MessageDTO> getMessages(Long conversationId, String userEmail) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        if (!conv.getBuyerEmail().equals(userEmail) && !conv.getSellerEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied");
        }
        return chatMessageRepository.findByConversationIdOrderBySentAtAsc(conversationId)
                .stream().map(this::toDTO).toList();
    }

    @Override
    public MessageDTO saveMessage(String senderEmail, SendMessageDTO dto) {
        Conversation conv = conversationRepository.findById(dto.getConversationId())
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        if (!conv.getBuyerEmail().equals(senderEmail) && !conv.getSellerEmail().equals(senderEmail)) {
            throw new RuntimeException("Access denied");
        }
        ChatMessage msg = new ChatMessage();
        msg.setConversationId(dto.getConversationId());
        msg.setSenderEmail(senderEmail);
        msg.setContent(dto.getContent());
        return toDTO(chatMessageRepository.save(msg));
    }

    private ConversationDTO toDTO(Conversation c) {
        return new ConversationDTO(c.getId(), c.getAdId(),
                c.getBuyerEmail(), c.getSellerEmail(), c.getAdTitle(), c.getCreatedAt());
    }

    private MessageDTO toDTO(ChatMessage m) {
        return new MessageDTO(m.getId(), m.getConversationId(),
                m.getSenderEmail(), m.getContent(), m.getSentAt());
    }
}