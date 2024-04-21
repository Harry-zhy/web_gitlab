package team.bham.data;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.BookedActivity;
import team.bham.repository.BookedActivityRepository;

@Component
public class BookedActivityDataLoader implements ApplicationRunner {

    private final BookedActivityRepository entityRepository;

    public BookedActivityDataLoader(BookedActivityRepository entityRepository) {
        this.entityRepository = entityRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String[] names = new String[] {
            "Cooking",
            "Music",
            "Outdoor Adventure",
            "Wine Tasting",
            "Acting and Performances",
            "Relaxation and Meditation",
            "Artisan",
            "Fitness",
            "Technology",
            "Gardening and Wellness",
            "Specialised Team Building",
        };
        long x = 0L;
        for (int i = 0; i < names.length; i++) {
            BookedActivity entity = new BookedActivity();
            entity.setId(x);
            entity.setName(names[i]);
            entityRepository.save(entity);
            x = x + 1;
        }
    }
}
