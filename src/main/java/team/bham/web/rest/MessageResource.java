package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Message;
import team.bham.repository.MessageRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Message}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MessageResource {

    private final Logger log = LoggerFactory.getLogger(MessageResource.class);

    private static final String ENTITY_NAME = "message";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MessageRepository messageRepository;

    public MessageResource(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    /**
     * {@code POST  /messages} : Create a new message.
     *
     * @param message the message to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new message, or with status {@code 400 (Bad Request)} if the message has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/messages")
    public ResponseEntity<Message> createMessage(@RequestBody Message message) throws URISyntaxException {
        log.debug("REST request to save Message : {}", message);
        if (message.getId() != null) {
            throw new BadRequestAlertException("A new message cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Message result = messageRepository.save(message);
        return ResponseEntity
            .created(new URI("/api/messages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /messages/:id} : Updates an existing message.
     *
     * @param id the id of the message to save.
     * @param message the message to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated message,
     * or with status {@code 400 (Bad Request)} if the message is not valid,
     * or with status {@code 500 (Internal Server Error)} if the message couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/messages/{id}")
    public ResponseEntity<Message> updateMessage(@PathVariable(value = "id", required = false) final Long id, @RequestBody Message message)
        throws URISyntaxException {
        log.debug("REST request to update Message : {}, {}", id, message);
        if (message.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, message.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!messageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Message result = messageRepository.save(message);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, message.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /messages/:id} : Partial updates given fields of an existing message, field will ignore if it is null
     *
     * @param id the id of the message to save.
     * @param message the message to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated message,
     * or with status {@code 400 (Bad Request)} if the message is not valid,
     * or with status {@code 404 (Not Found)} if the message is not found,
     * or with status {@code 500 (Internal Server Error)} if the message couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/messages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Message> partialUpdateMessage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Message message
    ) throws URISyntaxException {
        log.debug("REST request to partial update Message partially : {}, {}", id, message);
        if (message.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, message.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!messageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Message> result = messageRepository
            .findById(message.getId())
            .map(existingMessage -> {
                if (message.getContent() != null) {
                    existingMessage.setContent(message.getContent());
                }
                if (message.getSenderName() != null) {
                    existingMessage.setSenderName(message.getSenderName());
                }
                if (message.getType() != null) {
                    existingMessage.setType(message.getType());
                }
                if (message.getSentDate() != null) {
                    existingMessage.setSentDate(message.getSentDate());
                }
                if (message.getSendTo() != null) {
                    existingMessage.setSendTo(message.getSendTo());
                }

                return existingMessage;
            })
            .map(messageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, message.getId().toString())
        );
    }

    /**
     * {@code GET  /messages} : get all the messages.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of messages in body.
     */
    @GetMapping("/messages")
    public List<Message> getAllMessages(@RequestParam(required = false) String filter) {
        if ("notification-is-null".equals(filter)) {
            log.debug("REST request to get all Messages where notification is null");
            return StreamSupport
                .stream(messageRepository.findAll().spliterator(), false)
                .filter(message -> message.getNotification() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Messages");
        return messageRepository.findAll();
    }

    /**
     * {@code GET  /messages/:id} : get the "id" message.
     *
     * @param id the id of the message to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the message, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/messages/{id}")
    public ResponseEntity<Message> getMessage(@PathVariable Long id) {
        log.debug("REST request to get Message : {}", id);
        Optional<Message> message = messageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(message);
    }

    /**
     * {@code DELETE  /messages/:id} : delete the "id" message.
     *
     * @param id the id of the message to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        log.debug("REST request to delete Message : {}", id);
        messageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * GET /messages/by-email/{email} : Get messages by email.
     *
     * @param email the email of the user to retrieve messages.
     * @return the ResponseEntity with status 200 (OK) and with body the list of messages, or with status 404 (Not Found).
     */
    @GetMapping("/messages/by-email/{email}")
    public List<Message> getMessagesByEmail(@PathVariable String email) {
        log.debug("REST request to get Messages by email : {}", email);
        List<Message> messages = messageRepository.findBySendTo(email);
        return messages;
    }
}
