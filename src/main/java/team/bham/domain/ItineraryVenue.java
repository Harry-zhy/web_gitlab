package team.bham.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ItineraryVenue.
 */
@Entity
@Table(name = "itinerary_venue")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ItineraryVenue implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "venue_name")
    private String venueName;

    @Column(name = "venue_cost")
    private Float venueCost;

    @Column(name = "venue_host")
    private String venueHost;

    @Column(name = "venue_address")
    private String venueAddress;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ItineraryVenue id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVenueName() {
        return this.venueName;
    }

    public ItineraryVenue venueName(String venueName) {
        this.setVenueName(venueName);
        return this;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public Float getVenueCost() {
        return this.venueCost;
    }

    public ItineraryVenue venueCost(Float venueCost) {
        this.setVenueCost(venueCost);
        return this;
    }

    public void setVenueCost(Float venueCost) {
        this.venueCost = venueCost;
    }

    public String getVenueHost() {
        return this.venueHost;
    }

    public ItineraryVenue venueHost(String venueHost) {
        this.setVenueHost(venueHost);
        return this;
    }

    public void setVenueHost(String venueHost) {
        this.venueHost = venueHost;
    }

    public String getVenueAddress() {
        return this.venueAddress;
    }

    public ItineraryVenue venueAddress(String venueAddress) {
        this.setVenueAddress(venueAddress);
        return this;
    }

    public void setVenueAddress(String venueAddress) {
        this.venueAddress = venueAddress;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ItineraryVenue)) {
            return false;
        }
        return id != null && id.equals(((ItineraryVenue) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ItineraryVenue{" +
            "id=" + getId() +
            ", venueName='" + getVenueName() + "'" +
            ", venueCost=" + getVenueCost() +
            ", venueHost='" + getVenueHost() + "'" +
            ", venueAddress='" + getVenueAddress() + "'" +
            "}";
    }
}
