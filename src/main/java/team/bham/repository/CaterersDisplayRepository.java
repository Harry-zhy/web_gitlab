package team.bham.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import team.bham.domain.*;

@SuppressWarnings("unused")
@Repository
public interface CaterersDisplayRepository extends JpaRepository<Caterers, Long> {
    List<Caterers> findAll(Caterers caterers);
}
