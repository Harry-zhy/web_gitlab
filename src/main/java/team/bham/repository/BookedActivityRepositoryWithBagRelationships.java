package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.BookedActivity;

public interface BookedActivityRepositoryWithBagRelationships {
    Optional<BookedActivity> fetchBagRelationships(Optional<BookedActivity> bookedActivity);

    List<BookedActivity> fetchBagRelationships(List<BookedActivity> bookedActivities);

    Page<BookedActivity> fetchBagRelationships(Page<BookedActivity> bookedActivities);
}
