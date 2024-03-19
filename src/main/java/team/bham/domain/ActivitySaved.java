package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ActivitySaved.
 */
@Entity
@Table(name = "activity_saved")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ActivitySaved implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "date", nullable = false)
    private ZonedDateTime date;

    @Column(name = "company")
    private String company;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "eventDate", "activitySaveds", "src/main/webapp/app/caterers/caterers", "venueInformations", "itineraryGuests" },
        allowSetters = true
    )
    private EventItinerary eventItinerary;

    @ManyToMany(mappedBy = "activitySaveds")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "activitySaveds", "activityCompanies", "ratings" }, allowSetters = true)
    private Set<BookedActivity> bookedActivities = new HashSet<>();

    @ManyToMany(mappedBy = "activitySaveds")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "activitySaveds", "event", "activityIdeas", "activityImages", "ratings" }, allowSetters = true)
    private Set<ActivitySelf> activitySelves = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ActivitySaved id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ActivitySaved name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public ActivitySaved date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getCompany() {
        return this.company;
    }

    public ActivitySaved company(String company) {
        this.setCompany(company);
        return this;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public EventItinerary getEventItinerary() {
        return this.eventItinerary;
    }

    public void setEventItinerary(EventItinerary eventItinerary) {
        this.eventItinerary = eventItinerary;
    }

    public ActivitySaved eventItinerary(EventItinerary eventItinerary) {
        this.setEventItinerary(eventItinerary);
        return this;
    }

    public Set<BookedActivity> getBookedActivities() {
        return this.bookedActivities;
    }

    public void setBookedActivities(Set<BookedActivity> bookedActivities) {
        if (this.bookedActivities != null) {
            this.bookedActivities.forEach(i -> i.removeActivitySaved(this));
        }
        if (bookedActivities != null) {
            bookedActivities.forEach(i -> i.addActivitySaved(this));
        }
        this.bookedActivities = bookedActivities;
    }

    public ActivitySaved bookedActivities(Set<BookedActivity> bookedActivities) {
        this.setBookedActivities(bookedActivities);
        return this;
    }

    public ActivitySaved addBookedActivity(BookedActivity bookedActivity) {
        this.bookedActivities.add(bookedActivity);
        bookedActivity.getActivitySaveds().add(this);
        return this;
    }

    public ActivitySaved removeBookedActivity(BookedActivity bookedActivity) {
        this.bookedActivities.remove(bookedActivity);
        bookedActivity.getActivitySaveds().remove(this);
        return this;
    }

    public Set<ActivitySelf> getActivitySelves() {
        return this.activitySelves;
    }

    public void setActivitySelves(Set<ActivitySelf> activitySelves) {
        if (this.activitySelves != null) {
            this.activitySelves.forEach(i -> i.removeActivitySaved(this));
        }
        if (activitySelves != null) {
            activitySelves.forEach(i -> i.addActivitySaved(this));
        }
        this.activitySelves = activitySelves;
    }

    public ActivitySaved activitySelves(Set<ActivitySelf> activitySelves) {
        this.setActivitySelves(activitySelves);
        return this;
    }

    public ActivitySaved addActivitySelf(ActivitySelf activitySelf) {
        this.activitySelves.add(activitySelf);
        activitySelf.getActivitySaveds().add(this);
        return this;
    }

    public ActivitySaved removeActivitySelf(ActivitySelf activitySelf) {
        this.activitySelves.remove(activitySelf);
        activitySelf.getActivitySaveds().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActivitySaved)) {
            return false;
        }
        return id != null && id.equals(((ActivitySaved) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActivitySaved{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", date='" + getDate() + "'" +
            ", company='" + getCompany() + "'" +
            "}";
    }
}
