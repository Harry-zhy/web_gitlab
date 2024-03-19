package team.bham.service;

import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import team.bham.domain.*;
import team.bham.repository.*;

@Service
public class EventItineraryService {

    private final Logger log = LoggerFactory.getLogger(EventItineraryService.class);

    private final EventItineraryRepository eventItineraryRepository;

    public EventItineraryService(EventItineraryRepository eventItineraryRepository) {
        this.eventItineraryRepository = eventItineraryRepository;
    }

    public void eventSetDate(ItineraryDateTime eventItineraryDateTime) {
        eventItineraryRepository.EventDate(eventItineraryDateTime);
    }
}
