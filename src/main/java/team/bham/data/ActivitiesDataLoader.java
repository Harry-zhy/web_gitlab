package team.bham.data;

import java.awt.print.Book;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.BookedActivity;
import team.bham.repository.BookedActivityRepository;

@Component
public class ActivitiesDataLoader implements ApplicationRunner {

    private final BookedActivityRepository entityRepository;

    public ActivitiesDataLoader(BookedActivityRepository entityRepository) {
        this.entityRepository = entityRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        // Add initial data here
        BookedActivity entity1 = new BookedActivity();
        entity1.setId(1L);
        entity1.setName("Cooking");
        // Set other fields
        entityRepository.save(entity1);

        BookedActivity entity2 = new BookedActivity();
        entity2.setId(2L);
        entity2.setName("Music");
        entityRepository.save(entity2);

        BookedActivity entity3 = new BookedActivity();
        entity3.setId(3L);
        entity3.setName("Outdoor Adventure");
        entityRepository.save(entity3);

        BookedActivity entity4 = new BookedActivity();
        entity4.setId(4L);
        entity4.setName("Wine Tasting");
        entityRepository.save(entity4);

        BookedActivity entity5 = new BookedActivity();
        entity5.setId(5L);
        entity5.setName("Acting and Performances");
        entityRepository.save(entity5);
        // Add more entities as needed
    }
}
