package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ItineraryGuest.
 */
@Entity
@Table(name = "itinerary_guest")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ItineraryGuest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "rsvp_status")
    private Boolean rsvpStatus;

    @ManyToMany
    @JoinTable(
        name = "rel_itinerary_guest__event_itinerary",
        joinColumns = @JoinColumn(name = "itinerary_guest_id"),
        inverseJoinColumns = @JoinColumn(name = "event_itinerary_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "eventDate", "activitySaveds", "src/main/webapp/app/caterers/caterers", "venueInformations", "itineraryGuests" },
        allowSetters = true
    )
    private Set<EventItinerary> eventItineraries = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    private String generateRandomString() {
        int leftLimit = 97;
        int rightLimit = 122;
        int targetStringLength = 10;
        Random random = new Random();
        StringBuilder buffer = new StringBuilder(targetStringLength);
        for (int i = 0; i < targetStringLength; i++) {
            int randomLimitedInt = leftLimit + (int) (random.nextFloat() * (rightLimit - leftLimit + 1));
            buffer.append((char) randomLimitedInt);
        }
        return buffer.toString();
    }

    // Method to generate a random boolean value
    private boolean generateRandomBoolean() {
        return Math.random() < 0.5;
    }

    // Method to generate a random integer value between min and max
    private int generateRandomInteger(int min, int max) {
        min = 1;
        max = 9999;
        return (int) (Math.random() * (max - min + 1)) + min;
    }

    public Long getId() {
        return this.id;
    }

    public ItineraryGuest id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ItineraryGuest name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = generateRandomString();
    }

    public String getEmail() {
        return this.email;
    }

    public ItineraryGuest email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = generateRandomString() + "@example.com";
    }

    public Boolean getRsvpStatus() {
        return this.rsvpStatus;
    }

    public ItineraryGuest rsvpStatus(Boolean rsvpStatus) {
        this.setRsvpStatus(rsvpStatus);
        return this;
    }

    public void setRsvpStatus(Boolean rsvpStatus) {
        this.rsvpStatus = generateRandomBoolean();
    }

    public Set<EventItinerary> getEventItineraries() {
        return this.eventItineraries;
    }

    public void setEventItineraries(Set<EventItinerary> eventItineraries) {
        this.eventItineraries = eventItineraries;
    }

    public ItineraryGuest eventItineraries(Set<EventItinerary> eventItineraries) {
        this.setEventItineraries(eventItineraries);
        return this;
    }

    public ItineraryGuest addEventItinerary(EventItinerary eventItinerary) {
        this.eventItineraries.add(eventItinerary);
        eventItinerary.getItineraryGuests().add(this);
        return this;
    }

    public ItineraryGuest removeEventItinerary(EventItinerary eventItinerary) {
        this.eventItineraries.remove(eventItinerary);
        eventItinerary.getItineraryGuests().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ItineraryGuest)) {
            return false;
        }
        return id != null && id.equals(((ItineraryGuest) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ItineraryGuest{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", email='" + getEmail() + "'" +
            ", rsvpStatus='" + getRsvpStatus() + "'" +
            "}";
    }
}
