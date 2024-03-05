package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.ActivitySelf;

public interface ActivitySelfRepositoryWithBagRelationships {
    Optional<ActivitySelf> fetchBagRelationships(Optional<ActivitySelf> activitySelf);

    List<ActivitySelf> fetchBagRelationships(List<ActivitySelf> activitySelves);

    Page<ActivitySelf> fetchBagRelationships(Page<ActivitySelf> activitySelves);
}
