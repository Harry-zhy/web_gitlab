package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A VenueInformation.
 */
@Entity
@Table(name = "venue_information")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VenueInformation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private Float price;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "location")
    private String location;

    @Column(name = "opening_time_from")
    private ZonedDateTime openingTimeFrom;

    @Column(name = "opening_time_until")
    private ZonedDateTime openingTimeUntil;

    @Lob
    @Column(name = "picture")
    private byte[] picture;

    @Column(name = "picture_content_type")
    private String pictureContentType;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "eventDate", "activitySaveds", "caterers", "venueInformations", "itineraryGuests" },
        allowSetters = true
    )
    private EventItinerary eventItinerary;

    @ManyToOne
    @JsonIgnoreProperties(
        value = {
            "feedbacks",
            "venueInformations",
            "adsManagements",
            "businessInformations",
            "activityCompany",
            "decoCompany",
            "notification",
            "caterers",
        },
        allowSetters = true
    )
    private Supplier supplier;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VenueInformation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public VenueInformation name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getPrice() {
        return this.price;
    }

    public VenueInformation price(Float price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Integer getCapacity() {
        return this.capacity;
    }

    public VenueInformation capacity(Integer capacity) {
        this.setCapacity(capacity);
        return this;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getLocation() {
        return this.location;
    }

    public VenueInformation location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public ZonedDateTime getOpeningTimeFrom() {
        return this.openingTimeFrom;
    }

    public VenueInformation openingTimeFrom(ZonedDateTime openingTimeFrom) {
        this.setOpeningTimeFrom(openingTimeFrom);
        return this;
    }

    public void setOpeningTimeFrom(ZonedDateTime openingTimeFrom) {
        this.openingTimeFrom = openingTimeFrom;
    }

    public ZonedDateTime getOpeningTimeUntil() {
        return this.openingTimeUntil;
    }

    public VenueInformation openingTimeUntil(ZonedDateTime openingTimeUntil) {
        this.setOpeningTimeUntil(openingTimeUntil);
        return this;
    }

    public void setOpeningTimeUntil(ZonedDateTime openingTimeUntil) {
        this.openingTimeUntil = openingTimeUntil;
    }

    public byte[] getPicture() {
        return this.picture;
    }

    public VenueInformation picture(byte[] picture) {
        this.setPicture(picture);
        return this;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public String getPictureContentType() {
        return this.pictureContentType;
    }

    public VenueInformation pictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
        return this;
    }

    public void setPictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
    }

    public EventItinerary getEventItinerary() {
        return this.eventItinerary;
    }

    public void setEventItinerary(EventItinerary eventItinerary) {
        this.eventItinerary = eventItinerary;
    }

    public VenueInformation eventItinerary(EventItinerary eventItinerary) {
        this.setEventItinerary(eventItinerary);
        return this;
    }

    public Supplier getSupplier() {
        return this.supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public VenueInformation supplier(Supplier supplier) {
        this.setSupplier(supplier);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VenueInformation)) {
            return false;
        }
        return id != null && id.equals(((VenueInformation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VenueInformation{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", price=" + getPrice() +
            ", capacity=" + getCapacity() +
            ", location='" + getLocation() + "'" +
            ", openingTimeFrom='" + getOpeningTimeFrom() + "'" +
            ", openingTimeUntil='" + getOpeningTimeUntil() + "'" +
            ", picture='" + getPicture() + "'" +
            ", pictureContentType='" + getPictureContentType() + "'" +
            "}";
    }
}
