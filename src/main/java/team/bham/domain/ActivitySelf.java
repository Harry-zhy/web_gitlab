package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ActivitySelf.
 */
@Entity
@Table(name = "activity_self")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ActivitySelf implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToMany
    @JoinTable(
        name = "rel_activity_self__activity_saved",
        joinColumns = @JoinColumn(name = "activity_self_id"),
        inverseJoinColumns = @JoinColumn(name = "activity_saved_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "eventItinerary", "bookedActivities", "activitySelves" }, allowSetters = true)
    private Set<ActivitySaved> activitySaveds = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "venue", "caterers", "activities" }, allowSetters = true)
    private Event event;

    @OneToMany(mappedBy = "activitySelf")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "activitySelf" }, allowSetters = true)
    private Set<ActivityIdea> activityIdeas = new HashSet<>();

    @OneToMany(mappedBy = "activitySelf")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "activityCompany", "activitySelf" }, allowSetters = true)
    private Set<ActivityImage> activityImages = new HashSet<>();

    @OneToMany(mappedBy = "activitySelf")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "caterers", "activityCompany", "bookedActivity", "activitySelf" }, allowSetters = true)
    private Set<Rating> ratings = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ActivitySelf id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ActivitySelf name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public ActivitySelf description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<ActivitySaved> getActivitySaveds() {
        return this.activitySaveds;
    }

    public void setActivitySaveds(Set<ActivitySaved> activitySaveds) {
        this.activitySaveds = activitySaveds;
    }

    public ActivitySelf activitySaveds(Set<ActivitySaved> activitySaveds) {
        this.setActivitySaveds(activitySaveds);
        return this;
    }

    public ActivitySelf addActivitySaved(ActivitySaved activitySaved) {
        this.activitySaveds.add(activitySaved);
        activitySaved.getActivitySelves().add(this);
        return this;
    }

    public ActivitySelf removeActivitySaved(ActivitySaved activitySaved) {
        this.activitySaveds.remove(activitySaved);
        activitySaved.getActivitySelves().remove(this);
        return this;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public ActivitySelf event(Event event) {
        this.setEvent(event);
        return this;
    }

    public Set<ActivityIdea> getActivityIdeas() {
        return this.activityIdeas;
    }

    public void setActivityIdeas(Set<ActivityIdea> activityIdeas) {
        if (this.activityIdeas != null) {
            this.activityIdeas.forEach(i -> i.setActivitySelf(null));
        }
        if (activityIdeas != null) {
            activityIdeas.forEach(i -> i.setActivitySelf(this));
        }
        this.activityIdeas = activityIdeas;
    }

    public ActivitySelf activityIdeas(Set<ActivityIdea> activityIdeas) {
        this.setActivityIdeas(activityIdeas);
        return this;
    }

    public ActivitySelf addActivityIdea(ActivityIdea activityIdea) {
        this.activityIdeas.add(activityIdea);
        activityIdea.setActivitySelf(this);
        return this;
    }

    public ActivitySelf removeActivityIdea(ActivityIdea activityIdea) {
        this.activityIdeas.remove(activityIdea);
        activityIdea.setActivitySelf(null);
        return this;
    }

    public Set<ActivityImage> getActivityImages() {
        return this.activityImages;
    }

    public void setActivityImages(Set<ActivityImage> activityImages) {
        if (this.activityImages != null) {
            this.activityImages.forEach(i -> i.setActivitySelf(null));
        }
        if (activityImages != null) {
            activityImages.forEach(i -> i.setActivitySelf(this));
        }
        this.activityImages = activityImages;
    }

    public ActivitySelf activityImages(Set<ActivityImage> activityImages) {
        this.setActivityImages(activityImages);
        return this;
    }

    public ActivitySelf addActivityImage(ActivityImage activityImage) {
        this.activityImages.add(activityImage);
        activityImage.setActivitySelf(this);
        return this;
    }

    public ActivitySelf removeActivityImage(ActivityImage activityImage) {
        this.activityImages.remove(activityImage);
        activityImage.setActivitySelf(null);
        return this;
    }

    public Set<Rating> getRatings() {
        return this.ratings;
    }

    public void setRatings(Set<Rating> ratings) {
        if (this.ratings != null) {
            this.ratings.forEach(i -> i.setActivitySelf(null));
        }
        if (ratings != null) {
            ratings.forEach(i -> i.setActivitySelf(this));
        }
        this.ratings = ratings;
    }

    public ActivitySelf ratings(Set<Rating> ratings) {
        this.setRatings(ratings);
        return this;
    }

    public ActivitySelf addRating(Rating rating) {
        this.ratings.add(rating);
        rating.setActivitySelf(this);
        return this;
    }

    public ActivitySelf removeRating(Rating rating) {
        this.ratings.remove(rating);
        rating.setActivitySelf(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActivitySelf)) {
            return false;
        }
        return id != null && id.equals(((ActivitySelf) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActivitySelf{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
