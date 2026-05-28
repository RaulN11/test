package cars.microservices.ChatMicroservice.controllers;

import cars.microservices.ChatMicroservice.dtos.*;
import cars.microservices.ChatMicroservice.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat/api")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatService chatService;
    @PostMapping("/conversations")
    public ResponseEntity<ConversationDTO> startConversation(
            @AuthenticationPrincipal String email,
            @RequestBody StartConversationDTO dto) {
        return ResponseEntity.ok(chatService.getOrCreateConversation(email, dto));
    }
    @GetMapping("/conversations")
    public List<ConversationDTO> myConversations(@AuthenticationPrincipal String email) {
        return chatService.getMyConversations(email);
    }


    @GetMapping("/conversations/{id}/messages")
    public List<MessageDTO> getMessages(@PathVariable Long id,
                                        @AuthenticationPrincipal String email) {
        return chatService.getMessages(id, email);
    }
}