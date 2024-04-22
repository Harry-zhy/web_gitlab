package team.bham.data;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import team.bham.repository.CaterersRepository;
import team.bham.repository.CuisineRepository;
import team.bham.repository.DietaryRequirementsRepository;

@Component
public class CaterersDataLoader implements ApplicationRunner {

    private final CaterersRepository caterersRepository;
    private final CuisineRepository cuisineRepository;

    private final DietaryRequirementsRepository dietaryRequirementsRepository;

    public CaterersDataLoader(
        CaterersRepository entityRepository,
        CuisineRepository CaterercompanyRepository,
        DietaryRequirementsRepository CatererdietaryRequirementsRepository
    ) {
        this.caterersRepository = entityRepository;
        this.cuisineRepository = CaterercompanyRepository;
        this.dietaryRequirementsRepository = CatererdietaryRequirementsRepository;
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
