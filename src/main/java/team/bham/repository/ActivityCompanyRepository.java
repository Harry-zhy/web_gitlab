package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ActivityCompany;
import team.bham.domain.BookedActivity;

/**
 * Spring Data JPA repository for the ActivityCompany entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActivityCompanyRepository extends JpaRepository<ActivityCompany, Long> {
    List<ActivityCompany> findAllByBookedActivity(BookedActivity bookedActivity);
}
