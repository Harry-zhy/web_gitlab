package team.bham.data;

import java.util.Optional;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.ActivityCompany;
import team.bham.domain.BookedActivity;
import team.bham.repository.ActivityCompanyRepository;
import team.bham.repository.BookedActivityRepository;

@Component
public class ActivityCompanyDataLoader implements ApplicationRunner {

    private final BookedActivityRepository bookedEntityRepository;
    private final ActivityCompanyRepository companyEntityRepository;

    public ActivityCompanyDataLoader(BookedActivityRepository entityRepository, ActivityCompanyRepository companyRepository) {
        this.bookedEntityRepository = entityRepository;
        this.companyEntityRepository = companyRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        //        String[] description = new String[]{""};
        //        Long[] ids = new Long[]{};
        //        long x = 0L;
        //        for(int i =0; i<description.length; i++){
        //            ActivityCompany entity = new ActivityCompany();
        //            entity.setId(x);
        //            entity.setAbout(description[i]);
        //            Optional<BookedActivity> self = bookedEntityRepository.findById(1L);
        //            entity.setBookedActivity(self.get());
        //            companyEntityRepository.save(entity);
        //            x = x +1;}

    }
}
