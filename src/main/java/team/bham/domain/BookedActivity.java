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
 * A BookedActivity.
 */
@Entity
@Table(name = "booked_activity")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BookedActivity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @ManyToMany
    @JoinTable(
        name = "rel_booked_activity__activity_saved",
        joinColumns = @JoinColumn(name = "booked_activity_id"),
        inverseJoinColumns = @JoinColumn(name = "activity_saved_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "eventItinerary", "bookedActivities", "activitySelves" }, allowSetters = true)
    private Set<ActivitySaved> activitySaveds = new HashSet<>();

    @OneToMany(mappedBy = "bookedActivity")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "supplier", "bookedActivity", "activityContactDetails", "activityImages", "ratings" },
        allowSetters = true
    )
    private Set<ActivityCompany> activityCompanies = new HashSet<>();

    @OneToMany(mappedBy = "bookedActivity")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "caterers", "activityCompany", "bookedActivity", "activitySelf" }, allowSetters = true)
    private Set<Rating> ratings = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BookedActivity id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public BookedActivity name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<ActivitySaved> getActivitySaveds() {
        return this.activitySaveds;
    }

    public void setActivitySaveds(Set<ActivitySaved> activitySaveds) {
        this.activitySaveds = activitySaveds;
    }

    public BookedActivity activitySaveds(Set<ActivitySaved> activitySaveds) {
        this.setActivitySaveds(activitySaveds);
        return this;
    }

    public BookedActivity addActivitySaved(ActivitySaved activitySaved) {
        this.activitySaveds.add(activitySaved);
        activitySaved.getBookedActivities().add(this);
        return this;
    }

    public BookedActivity removeActivitySaved(ActivitySaved activitySaved) {
        this.activitySaveds.remove(activitySaved);
        activitySaved.getBookedActivities().remove(this);
        return this;
    }

    public Set<ActivityCompany> getActivityCompanies() {
        return this.activityCompanies;
    }

    public void setActivityCompanies(Set<ActivityCompany> activityCompanies) {
        if (this.activityCompanies != null) {
            this.activityCompanies.forEach(i -> i.setBookedActivity(null));
        }
        if (activityCompanies != null) {
            activityCompanies.forEach(i -> i.setBookedActivity(this));
        }
        this.activityCompanies = activityCompanies;
    }

    public BookedActivity activityCompanies(Set<ActivityCompany> activityCompanies) {
        this.setActivityCompanies(activityCompanies);
        return this;
    }

    public BookedActivity addActivityCompany(ActivityCompany activityCompany) {
        this.activityCompanies.add(activityCompany);
        activityCompany.setBookedActivity(this);
        return this;
    }

    public BookedActivity removeActivityCompany(ActivityCompany activityCompany) {
        this.activityCompanies.remove(activityCompany);
        activityCompany.setBookedActivity(null);
        return this;
    }

    public Set<Rating> getRatings() {
        return this.ratings;
    }

    public void setRatings(Set<Rating> ratings) {
        if (this.ratings != null) {
            this.ratings.forEach(i -> i.setBookedActivity(null));
        }
        if (ratings != null) {
            ratings.forEach(i -> i.setBookedActivity(this));
        }
        this.ratings = ratings;
    }

    public BookedActivity ratings(Set<Rating> ratings) {
        this.setRatings(ratings);
        return this;
    }

    public BookedActivity addRating(Rating rating) {
        this.ratings.add(rating);
        rating.setBookedActivity(this);
        return this;
    }

    public BookedActivity removeRating(Rating rating) {
        this.ratings.remove(rating);
        rating.setBookedActivity(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BookedActivity)) {
            return false;
        }
        return id != null && id.equals(((BookedActivity) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BookedActivity{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
