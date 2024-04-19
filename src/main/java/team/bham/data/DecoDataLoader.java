package team.bham.data;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.DecoCompany;
import team.bham.repository.DecoCompanyRepository;

@Component
public class DecoDataLoader implements ApplicationRunner {

    private final DecoCompanyRepository entityRepository;

    public DecoDataLoader(DecoCompanyRepository entityRepository) {
        this.entityRepository = entityRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        DecoCompany entity1 = new DecoCompany();
        entity1.setId(1L);
        entity1.setName("Elite Embellishments");
        entity1.setAbout(
            "Elite Embellishments is your premier destination for exquisite party decorations that transform any event into a magical experience. With a passion for creativity and a commitment to excellence, we specialize in providing top-of-the-line decorations for all occasions, from weddings and birthdays to corporate events and celebrations. Our expert team meticulously curates a stunning collection of décor items, including elegant centerpieces, vibrant balloon arrangements, and enchanting floral displays, tailored to suit every theme and style. With Elite Embellishments, every detail is thoughtfully crafted to elevate your event and create unforgettable memories for you and your guests. Let us turn your vision into reality and make your event truly extraordinary."
        );
        entity1.setRating(4);
        // Set other fields
        entityRepository.save(entity1);

        DecoCompany entity2 = new DecoCompany();
        entity2.setId(2L);
        entity2.setName("Elegant Arts");
        entity2.setAbout(
            "Elegant Arts is a leading provider of exquisite event decorations, dedicated to adding a touch of sophistication and charm to every occasion. With a blend of creativity, craftsmanship, and attention to detail, we specialize in creating stunning décor that captivates and inspires. From intimate gatherings to grand celebrations, our diverse range of artistic designs and premium materials ensures that every event is transformed into a memorable masterpiece. Whether it's enchanting floral arrangements, opulent table settings, or breathtaking backdrops, our talented team brings your vision to life with elegance and flair. At Elegant Arts, we believe that every event deserves to be celebrated in style, and we're committed to making your special moments truly unforgettable."
        );
        entity2.setRating(3);
        // Set other fields
        entityRepository.save(entity2);
        //        DecoCompany entity2 = new DecoCompany();
        //        entity2.setId(2L);
        //        entity2.setName("Elegant Arts");
        //        entity2.setAbout();
        //        entity2.setRating();
        //        // Set other fields
        //        entityRepository.save(entity2);
        //
        //        DecoCompany entity2 = new DecoCompany();
        //        entity2.setId(2L);
        //        entity2.setName("Elegant Arts");
        //        entity2.setAbout();
        //        entity2.setRating();
        //        // Set other fields
        //        entityRepository.save(entity2);
        //
        //        DecoCompany entity2 = new DecoCompany();
        //        entity2.setId(2L);
        //        entity2.setName("Elegant Arts");
        //        entity2.setAbout();
        //        entity2.setRating();
        //        // Set other fields
        //        entityRepository.save(entity2);
        //
        //        DecoCompany entity2 = new DecoCompany();
        //        entity2.setId(2L);
        //        entity2.setName("Elegant Arts");
        //        entity2.setAbout();
        //        entity2.setRating();
        //        // Set other fields
        //        entityRepository.save(entity2);
        //
        //        DecoCompany entity2 = new DecoCompany();
        //        entity2.setId(2L);
        //        entity2.setName("Elegant Arts");
        //        entity2.setAbout();
        //        entity2.setRating();
        //        // Set other fields
        //        entityRepository.save(entity2);
        //
        //        DecoCompany entity2 = new DecoCompany();
        //        entity2.setId(2L);
        //        entity2.setName("Elegant Arts");
        //        entity2.setAbout();
        //        entity2.setRating();
        //        // Set other fields
        //        entityRepository.save(entity2);
        //
        //        DecoCompany entity2 = new DecoCompany();
        //        entity2.setId(2L);
        //        entity2.setName("Elegant Arts");
        //        entity2.setAbout();
        //        entity2.setRating();
        //        // Set other fields
        //        entityRepository.save(entity2);
        //
        //        DecoCompany entity2 = new DecoCompany();
        //        entity2.setId(2L);
        //        entity2.setName("Elegant Arts");
        //        entity2.setAbout();
        //        entity2.setRating();
        //        // Set other fields
        //        entityRepository.save(entity2);
        //
        //        DecoCompany entity2 = new DecoCompany();
        //        entity2.setId(2L);
        //        entity2.setName("Elegant Arts");
        //        entity2.setAbout();
        //        entity2.setRating();
        //        // Set other fields
        //        entityRepository.save(entity2);
        //
        //        DecoCompany entity2 = new DecoCompany();
        //        entity2.setId(2L);
        //        entity2.setName("Elegant Arts");
        //        entity2.setAbout();
        //        entity2.setRating();
        //        // Set other fields
        //        entityRepository.save(entity2);
    }
}
