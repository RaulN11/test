package cars.microservices.ChatMicroservice.repositories;

import cars.microservices.ChatMicroservice.models.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByAdIdAndBuyerEmail(Long adId, String buyerEmail);
    List<Conversation> findByBuyerEmailOrSellerEmail(String buyerEmail, String sellerEmail);
}