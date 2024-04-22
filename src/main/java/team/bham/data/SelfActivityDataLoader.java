package team.bham.data;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.ActivitySelf;
import team.bham.repository.ActivitySelfRepository;

@Component
public class SelfActivityDataLoader implements ApplicationRunner {

    private final ActivitySelfRepository entityRepository;

    public SelfActivityDataLoader(ActivitySelfRepository entityRepository) {
        this.entityRepository = entityRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String[] names = new String[] {
            "Wellness Day",
            "Office Olympics",
            "Baking",
            "Outdoor Adventure",
            "Team Building Workshops",
            "Community Service",
            "Cooking",
            "Exploring Creativity",
            "Seminars",
            "Game Day",
            "Sports",
        };
        String[] description = new String[] {
            "Dedicate a day to wellness activities to promote relaxation, stress relief, and overall well-being among employees.",
            "Organise a series of fun and light-hearted competitive games or sport tournaments to encourage team spirit and camaraderie.",
            "Practice your baking skills and enjoy some sweet treats made by your fellow co-workers.",
            "Organise a day of outdoor activities to encourage teamwork, build moral, and promote a healthy lifestyle.",
            "Plan team-building activities to foster collaboration and communication among team members.",
            "Coordinate a community service project to give back to the community while simultaneously bonding as a team.",
            "Practice your cooking skills and taste different cuisines from all around the world made by yourselves and coworkers.",
            "Arrange creative workshops where participants can unleash their creativity and express themselves in a relaxed and fun environment.",
            "Host seminars or workshops so that your employees can enhance their skills, whether they are personal or business related improvements to their lives.",
            "Host games where teams or individuals can test their knowledge, compete in friendly competitions and enjoy some friendly rivalry.",
            "Promote fitness and well-being by hosting different sport games. Get to know your colleagues better by seeing their skill levels in different sports.",
        };

        long x = 0L;
        for (int i = 0; i < names.length; i++) {
            ActivitySelf entity = new ActivitySelf();
            entity.setId(x);
            entity.setName(names[i]);
            entity.setDescription(description[i]);
            entityRepository.save(entity);
            x = x + 1;
        }
    }
}
