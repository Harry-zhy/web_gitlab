package team.bham.data;

import java.util.Optional;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.ActivityIdea;
import team.bham.domain.ActivitySelf;
import team.bham.repository.ActivityIdeaRepository;
import team.bham.repository.ActivitySelfRepository;

@Component
public class ActivityIdeaDataLoader implements ApplicationRunner {

    private final ActivitySelfRepository SelfentityRepository;
    private final ActivityIdeaRepository IdeaEntityRepository;

    public ActivityIdeaDataLoader(ActivitySelfRepository entityRepository, ActivityIdeaRepository ideaRepository) {
        this.SelfentityRepository = entityRepository;
        this.IdeaEntityRepository = ideaRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        /*String[] description = new String[]{""};
        Long[] ids = new Long[]{};
        long x = 0L;
        for(int i =0; i<description.length; i++){
            ActivityIdea entity = new ActivityIdea();
            entity.setId(x);
            entity.setDescription(description[i]);
            Optional<ActivitySelf> self = SelfentityRepository.findById(1L);
            entity.setActivitySelf(self.get());
            IdeaEntityRepository.save(entity);
            x = x +1;}*/

    }
}
