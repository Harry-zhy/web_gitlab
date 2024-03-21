package team.bham.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, team.bham.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, team.bham.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, team.bham.domain.User.class.getName());
            createCache(cm, team.bham.domain.Authority.class.getName());
            createCache(cm, team.bham.domain.User.class.getName() + ".authorities");
            createCache(cm, team.bham.domain.ItineraryDateTime.class.getName());
            createCache(cm, team.bham.domain.ItineraryDateTime.class.getName() + ".eventItineraries");
            createCache(cm, team.bham.domain.ItineraryGuest.class.getName());
            createCache(cm, team.bham.domain.ItineraryGuest.class.getName() + ".eventItineraries");
            createCache(cm, team.bham.domain.ItineraryCaterer.class.getName());
            createCache(cm, team.bham.domain.ItineraryActivity.class.getName());
            createCache(cm, team.bham.domain.ItineraryVenue.class.getName());
            createCache(cm, team.bham.domain.EventItinerary.class.getName());
            createCache(cm, team.bham.domain.EventItinerary.class.getName() + ".activitySaveds");
            createCache(cm, team.bham.domain.EventItinerary.class.getName() + ".caterers");
            createCache(cm, team.bham.domain.EventItinerary.class.getName() + ".venueInformations");
            createCache(cm, team.bham.domain.EventItinerary.class.getName() + ".itineraryGuests");
            createCache(cm, team.bham.domain.Caterers.class.getName());
            createCache(cm, team.bham.domain.Caterers.class.getName() + ".dietaryRequirements");
            createCache(cm, team.bham.domain.Caterers.class.getName() + ".cuisines");
            createCache(cm, team.bham.domain.Caterers.class.getName() + ".ratings");
            createCache(cm, team.bham.domain.DietaryRequirements.class.getName());
            createCache(cm, team.bham.domain.DietaryRequirements.class.getName() + ".caterers");
            createCache(cm, team.bham.domain.Cuisine.class.getName());
            createCache(cm, team.bham.domain.Cuisine.class.getName() + ".caterers");
            createCache(cm, team.bham.domain.Itinerary.class.getName());
            createCache(cm, team.bham.domain.Itinerary.class.getName() + ".bookedCaterers");
            createCache(cm, team.bham.domain.BookedCaterer.class.getName());
            createCache(cm, team.bham.domain.ActivityCompany.class.getName());
            createCache(cm, team.bham.domain.ActivityCompany.class.getName() + ".activityImages");
            createCache(cm, team.bham.domain.ActivityCompany.class.getName() + ".ratings");
            createCache(cm, team.bham.domain.BookedActivity.class.getName());
            createCache(cm, team.bham.domain.BookedActivity.class.getName() + ".activitySaveds");
            createCache(cm, team.bham.domain.BookedActivity.class.getName() + ".activityCompanies");
            createCache(cm, team.bham.domain.BookedActivity.class.getName() + ".ratings");
            createCache(cm, team.bham.domain.ActivitySelf.class.getName());
            createCache(cm, team.bham.domain.ActivitySelf.class.getName() + ".activitySaveds");
            createCache(cm, team.bham.domain.ActivitySelf.class.getName() + ".activityIdeas");
            createCache(cm, team.bham.domain.ActivitySelf.class.getName() + ".activityImages");
            createCache(cm, team.bham.domain.ActivitySelf.class.getName() + ".ratings");
            createCache(cm, team.bham.domain.ActivityIdea.class.getName());
            createCache(cm, team.bham.domain.ActivitySaved.class.getName());
            createCache(cm, team.bham.domain.ActivitySaved.class.getName() + ".bookedActivities");
            createCache(cm, team.bham.domain.ActivitySaved.class.getName() + ".activitySelves");
            createCache(cm, team.bham.domain.ActivityImage.class.getName());
            createCache(cm, team.bham.domain.ActivityContactDetails.class.getName());
            createCache(cm, team.bham.domain.DecoCompany.class.getName());
            createCache(cm, team.bham.domain.DecoCompany.class.getName() + ".decoSavedCompanies");
            createCache(cm, team.bham.domain.DecoCompany.class.getName() + ".decoImages");
            createCache(cm, team.bham.domain.DecoCompany.class.getName() + ".decoBudgets");
            createCache(cm, team.bham.domain.DecoImages.class.getName());
            createCache(cm, team.bham.domain.DecoSavedCompany.class.getName());
            createCache(cm, team.bham.domain.DecoSavedCompany.class.getName() + ".decoCompanies");
            createCache(cm, team.bham.domain.DecoBudget.class.getName());
            createCache(cm, team.bham.domain.DecoBudget.class.getName() + ".decoCompanies");
            createCache(cm, team.bham.domain.DecoThemes.class.getName());
            createCache(cm, team.bham.domain.DecoThemes.class.getName() + ".decoSavedThemes");
            createCache(cm, team.bham.domain.DecoThemes.class.getName() + ".decoImages");
            createCache(cm, team.bham.domain.DecoSavedTheme.class.getName());
            createCache(cm, team.bham.domain.DecoSavedTheme.class.getName() + ".decoThemes");
            createCache(cm, team.bham.domain.DecoContactDetails.class.getName());
            createCache(cm, team.bham.domain.OneFeedback.class.getName());
            createCache(cm, team.bham.domain.Rating.class.getName());
            createCache(cm, team.bham.domain.Feedbacks.class.getName());
            createCache(cm, team.bham.domain.Feedbacks.class.getName() + ".oneFeedbacks");
            createCache(cm, team.bham.domain.Intro.class.getName());
            createCache(cm, team.bham.domain.Questionnaire.class.getName());
            createCache(cm, team.bham.domain.Questionnaire.class.getName() + ".questions");
            createCache(cm, team.bham.domain.Question.class.getName());
            createCache(cm, team.bham.domain.Question.class.getName() + ".parentQues");
            createCache(cm, team.bham.domain.Question.class.getName() + ".options");
            createCache(cm, team.bham.domain.MCQOption.class.getName());
            createCache(cm, team.bham.domain.Message.class.getName());
            createCache(cm, team.bham.domain.Notification.class.getName());
            createCache(cm, team.bham.domain.Supplier.class.getName());
            createCache(cm, team.bham.domain.Supplier.class.getName() + ".feedbacks");
            createCache(cm, team.bham.domain.Supplier.class.getName() + ".venueInformations");
            createCache(cm, team.bham.domain.Supplier.class.getName() + ".adsManagements");
            createCache(cm, team.bham.domain.Supplier.class.getName() + ".businessInformations");
            createCache(cm, team.bham.domain.Supplier.class.getName() + ".caterers");
            createCache(cm, team.bham.domain.VenueInformation.class.getName());
            createCache(cm, team.bham.domain.AdsManagement.class.getName());
            createCache(cm, team.bham.domain.BusinessInformation.class.getName());
            createCache(cm, team.bham.domain.MockCatererEntity.class.getName());
            createCache(cm, team.bham.domain.MockVenueEntity.class.getName());
            createCache(cm, team.bham.domain.MockActivityEntity.class.getName());
            createCache(cm, team.bham.domain.FavouritesListItem.class.getName());
            createCache(cm, team.bham.domain.FavouritesList.class.getName());
            createCache(cm, team.bham.domain.FavouritesList.class.getName() + ".favourites");
            createCache(cm, team.bham.domain.Event.class.getName());
            createCache(cm, team.bham.domain.Event.class.getName() + ".caterers");
            createCache(cm, team.bham.domain.Event.class.getName() + ".activities");
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
