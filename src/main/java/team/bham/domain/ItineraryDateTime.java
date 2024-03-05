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
 * A ItineraryDateTime.
 */
@Entity
@Table(name = "itinerary_date_time")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ItineraryDateTime implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "start_time")
    private ZonedDateTime startTime;

    @Column(name = "end_time")
    private ZonedDateTime endTime;

    @OneToMany(mappedBy = "eventDate")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "eventDate", "activitySaveds", "caterers", "venueInformations", "itineraryGuests" },
        allowSetters = true
    )
    private Set<EventItinerary> eventItineraries = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ItineraryDateTime id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public ItineraryDateTime date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public ZonedDateTime getStartTime() {
        return this.startTime;
    }

    public ItineraryDateTime startTime(ZonedDateTime startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(ZonedDateTime startTime) {
        this.startTime = startTime;
    }

    public ZonedDateTime getEndTime() {
        return this.endTime;
    }

    public ItineraryDateTime endTime(ZonedDateTime endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(ZonedDateTime endTime) {
        this.endTime = endTime;
    }

    public Set<EventItinerary> getEventItineraries() {
        return this.eventItineraries;
    }

    public void setEventItineraries(Set<EventItinerary> eventItineraries) {
        if (this.eventItineraries != null) {
            this.eventItineraries.forEach(i -> i.setEventDate(null));
        }
        if (eventItineraries != null) {
            eventItineraries.forEach(i -> i.setEventDate(this));
        }
        this.eventItineraries = eventItineraries;
    }

    public ItineraryDateTime eventItineraries(Set<EventItinerary> eventItineraries) {
        this.setEventItineraries(eventItineraries);
        return this;
    }

    public ItineraryDateTime addEventItinerary(EventItinerary eventItinerary) {
        this.eventItineraries.add(eventItinerary);
        eventItinerary.setEventDate(this);
        return this;
    }

    public ItineraryDateTime removeEventItinerary(EventItinerary eventItinerary) {
        this.eventItineraries.remove(eventItinerary);
        eventItinerary.setEventDate(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ItineraryDateTime)) {
            return false;
        }
        return id != null && id.equals(((ItineraryDateTime) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ItineraryDateTime{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            "}";
    }
}
