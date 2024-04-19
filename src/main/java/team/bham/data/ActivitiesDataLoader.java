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
        // Set other fields
        entityRepository.save(entity2);
        // Add more entities as needed
    }
}
