package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EventItinerary.
 */
@Entity
@Table(name = "event_itinerary")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EventItinerary implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "number_of_guests")
    private Integer numberOfGuests;

    @ManyToOne
    @JsonIgnoreProperties(value = { "eventItineraries" }, allowSetters = true)
    private ItineraryDateTime eventDate;

    @OneToMany(mappedBy = "eventItinerary")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "eventItinerary", "bookedActivities", "activitySelves" }, allowSetters = true)
    private Set<ActivitySaved> activitySaveds = new HashSet<>();

    @OneToMany(mappedBy = "eventItinerary")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "bookedCaterer", "eventItinerary", "supplier", "dietaryRequirements", "cuisines", "event", "ratings" },
        allowSetters = true
    )
    private Set<Caterers> caterers = new HashSet<>();

    @OneToMany(mappedBy = "eventItinerary")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "eventItinerary", "supplier" }, allowSetters = true)
    private Set<VenueInformation> venueInformations = new HashSet<>();

    @ManyToMany(mappedBy = "eventItineraries")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "eventItineraries" }, allowSetters = true)
    private Set<ItineraryGuest> itineraryGuests = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EventItinerary id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumberOfGuests() {
        return this.numberOfGuests;
    }

    public EventItinerary numberOfGuests(Integer numberOfGuests) {
        this.setNumberOfGuests(numberOfGuests);
        return this;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public ItineraryDateTime getEventDate() {
        return this.eventDate;
    }

    public void setEventDate(ItineraryDateTime itineraryDateTime) {
        this.eventDate = itineraryDateTime;
    }

    public EventItinerary eventDate(ItineraryDateTime itineraryDateTime) {
        this.setEventDate(itineraryDateTime);
        return this;
    }

    public Set<ActivitySaved> getActivitySaveds() {
        return this.activitySaveds;
    }

    public void setActivitySaveds(Set<ActivitySaved> activitySaveds) {
        if (this.activitySaveds != null) {
            this.activitySaveds.forEach(i -> i.setEventItinerary(null));
        }
        if (activitySaveds != null) {
            activitySaveds.forEach(i -> i.setEventItinerary(this));
        }
        this.activitySaveds = activitySaveds;
    }

    public EventItinerary activitySaveds(Set<ActivitySaved> activitySaveds) {
        this.setActivitySaveds(activitySaveds);
        return this;
    }

    public EventItinerary addActivitySaved(ActivitySaved activitySaved) {
        this.activitySaveds.add(activitySaved);
        activitySaved.setEventItinerary(this);
        return this;
    }

    public EventItinerary removeActivitySaved(ActivitySaved activitySaved) {
        this.activitySaveds.remove(activitySaved);
        activitySaved.setEventItinerary(null);
        return this;
    }

    public Set<Caterers> getCaterers() {
        return this.caterers;
    }

    public void setCaterers(Set<Caterers> caterers) {
        if (this.caterers != null) {
            this.caterers.forEach(i -> i.setEventItinerary(null));
        }
        if (caterers != null) {
            caterers.forEach(i -> i.setEventItinerary(this));
        }
        this.caterers = caterers;
    }

    public EventItinerary caterers(Set<Caterers> caterers) {
        this.setCaterers(caterers);
        return this;
    }

    public EventItinerary addCaterers(Caterers caterers) {
        this.caterers.add(caterers);
        caterers.setEventItinerary(this);
        return this;
    }

    public EventItinerary removeCaterers(Caterers caterers) {
        this.caterers.remove(caterers);
        caterers.setEventItinerary(null);
        return this;
    }

    public Set<VenueInformation> getVenueInformations() {
        return this.venueInformations;
    }

    public void setVenueInformations(Set<VenueInformation> venueInformations) {
        if (this.venueInformations != null) {
            this.venueInformations.forEach(i -> i.setEventItinerary(null));
        }
        if (venueInformations != null) {
            venueInformations.forEach(i -> i.setEventItinerary(this));
        }
        this.venueInformations = venueInformations;
    }

    public EventItinerary venueInformations(Set<VenueInformation> venueInformations) {
        this.setVenueInformations(venueInformations);
        return this;
    }

    public EventItinerary addVenueInformation(VenueInformation venueInformation) {
        this.venueInformations.add(venueInformation);
        venueInformation.setEventItinerary(this);
        return this;
    }

    public EventItinerary removeVenueInformation(VenueInformation venueInformation) {
        this.venueInformations.remove(venueInformation);
        venueInformation.setEventItinerary(null);
        return this;
    }

    public Set<ItineraryGuest> getItineraryGuests() {
        return this.itineraryGuests;
    }

    public void setItineraryGuests(Set<ItineraryGuest> itineraryGuests) {
        if (this.itineraryGuests != null) {
            this.itineraryGuests.forEach(i -> i.removeEventItinerary(this));
        }
        if (itineraryGuests != null) {
            itineraryGuests.forEach(i -> i.addEventItinerary(this));
        }
        this.itineraryGuests = itineraryGuests;
    }

    public EventItinerary itineraryGuests(Set<ItineraryGuest> itineraryGuests) {
        this.setItineraryGuests(itineraryGuests);
        return this;
    }

    public EventItinerary addItineraryGuest(ItineraryGuest itineraryGuest) {
        this.itineraryGuests.add(itineraryGuest);
        itineraryGuest.getEventItineraries().add(this);
        return this;
    }

    public EventItinerary removeItineraryGuest(ItineraryGuest itineraryGuest) {
        this.itineraryGuests.remove(itineraryGuest);
        itineraryGuest.getEventItineraries().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventItinerary)) {
            return false;
        }
        return id != null && id.equals(((EventItinerary) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EventItinerary{" +
            "id=" + getId() +
            ", numberOfGuests=" + getNumberOfGuests() +
            "}";
    }
}
