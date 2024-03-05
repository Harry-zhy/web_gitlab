package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Event.
 */
@Entity
@Table(name = "event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Event implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "spaces")
    private Integer spaces;

    @Column(name = "title")
    private String title;

    @OneToOne
    @JoinColumn(unique = true)
    private MockVenueEntity venue;

    @OneToMany(mappedBy = "event")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "bookedCaterer", "eventItinerary", "supplier", "dietaryRequirements", "cuisines", "event", "ratings" },
        allowSetters = true
    )
    private Set<Caterers> caterers = new HashSet<>();

    @OneToMany(mappedBy = "event")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "activitySaveds", "event", "activityIdeas", "activityImages", "ratings" }, allowSetters = true)
    private Set<ActivitySelf> activities = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Event id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Event date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Integer getSpaces() {
        return this.spaces;
    }

    public Event spaces(Integer spaces) {
        this.setSpaces(spaces);
        return this;
    }

    public void setSpaces(Integer spaces) {
        this.spaces = spaces;
    }

    public String getTitle() {
        return this.title;
    }

    public Event title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public MockVenueEntity getVenue() {
        return this.venue;
    }

    public void setVenue(MockVenueEntity mockVenueEntity) {
        this.venue = mockVenueEntity;
    }

    public Event venue(MockVenueEntity mockVenueEntity) {
        this.setVenue(mockVenueEntity);
        return this;
    }

    public Set<Caterers> getCaterers() {
        return this.caterers;
    }

    public void setCaterers(Set<Caterers> caterers) {
        if (this.caterers != null) {
            this.caterers.forEach(i -> i.setEvent(null));
        }
        if (caterers != null) {
            caterers.forEach(i -> i.setEvent(this));
        }
        this.caterers = caterers;
    }

    public Event caterers(Set<Caterers> caterers) {
        this.setCaterers(caterers);
        return this;
    }

    public Event addCaterers(Caterers caterers) {
        this.caterers.add(caterers);
        caterers.setEvent(this);
        return this;
    }

    public Event removeCaterers(Caterers caterers) {
        this.caterers.remove(caterers);
        caterers.setEvent(null);
        return this;
    }

    public Set<ActivitySelf> getActivities() {
        return this.activities;
    }

    public void setActivities(Set<ActivitySelf> activitySelves) {
        if (this.activities != null) {
            this.activities.forEach(i -> i.setEvent(null));
        }
        if (activitySelves != null) {
            activitySelves.forEach(i -> i.setEvent(this));
        }
        this.activities = activitySelves;
    }

    public Event activities(Set<ActivitySelf> activitySelves) {
        this.setActivities(activitySelves);
        return this;
    }

    public Event addActivities(ActivitySelf activitySelf) {
        this.activities.add(activitySelf);
        activitySelf.setEvent(this);
        return this;
    }

    public Event removeActivities(ActivitySelf activitySelf) {
        this.activities.remove(activitySelf);
        activitySelf.setEvent(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Event)) {
            return false;
        }
        return id != null && id.equals(((Event) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Event{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", spaces=" + getSpaces() +
            ", title='" + getTitle() + "'" +
            "}";
    }
}
