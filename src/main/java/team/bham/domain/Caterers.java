package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Caterers.
 */
@Entity
@Table(name = "caterers")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Caterers implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Lob
    @Column(name = "picture")
    private byte[] picture;

    @Column(name = "picture_content_type")
    private String pictureContentType;

    @Column(name = "price_per_person")
    private Double pricePerPerson;

    @Column(name = "guest_limit")
    private Integer guestLimit;

    @JsonIgnoreProperties(value = { "itinerary", "caterers" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private BookedCaterer bookedCaterer;

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

    @ManyToMany
    @JoinTable(
        name = "rel_caterers__dietary_requirements",
        joinColumns = @JoinColumn(name = "caterers_id"),
        inverseJoinColumns = @JoinColumn(name = "dietary_requirements_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "caterers" }, allowSetters = true)
    private Set<DietaryRequirements> dietaryRequirements = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_caterers__cuisine",
        joinColumns = @JoinColumn(name = "caterers_id"),
        inverseJoinColumns = @JoinColumn(name = "cuisine_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "caterers" }, allowSetters = true)
    private Set<Cuisine> cuisines = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "venue", "caterers", "activities" }, allowSetters = true)
    private Event event;

    @OneToMany(mappedBy = "caterers")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "caterers", "activityCompany", "bookedActivity", "activitySelf" }, allowSetters = true)
    private Set<Rating> ratings = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Caterers id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Caterers name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getPicture() {
        return this.picture;
    }

    public Caterers picture(byte[] picture) {
        this.setPicture(picture);
        return this;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public String getPictureContentType() {
        return this.pictureContentType;
    }

    public Caterers pictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
        return this;
    }

    public void setPictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
    }

    public Double getPricePerPerson() {
        return this.pricePerPerson;
    }

    public Caterers pricePerPerson(Double pricePerPerson) {
        this.setPricePerPerson(pricePerPerson);
        return this;
    }

    public void setPricePerPerson(Double pricePerPerson) {
        this.pricePerPerson = pricePerPerson;
    }

    public Integer getGuestLimit() {
        return this.guestLimit;
    }

    public Caterers guestLimit(Integer guestLimit) {
        this.setGuestLimit(guestLimit);
        return this;
    }

    public void setGuestLimit(Integer guestLimit) {
        this.guestLimit = guestLimit;
    }

    public BookedCaterer getBookedCaterer() {
        return this.bookedCaterer;
    }

    public void setBookedCaterer(BookedCaterer bookedCaterer) {
        this.bookedCaterer = bookedCaterer;
    }

    public Caterers bookedCaterer(BookedCaterer bookedCaterer) {
        this.setBookedCaterer(bookedCaterer);
        return this;
    }

    public EventItinerary getEventItinerary() {
        return this.eventItinerary;
    }

    public void setEventItinerary(EventItinerary eventItinerary) {
        this.eventItinerary = eventItinerary;
    }

    public Caterers eventItinerary(EventItinerary eventItinerary) {
        this.setEventItinerary(eventItinerary);
        return this;
    }

    public Supplier getSupplier() {
        return this.supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Caterers supplier(Supplier supplier) {
        this.setSupplier(supplier);
        return this;
    }

    public Set<DietaryRequirements> getDietaryRequirements() {
        return this.dietaryRequirements;
    }

    public void setDietaryRequirements(Set<DietaryRequirements> dietaryRequirements) {
        this.dietaryRequirements = dietaryRequirements;
    }

    public Caterers dietaryRequirements(Set<DietaryRequirements> dietaryRequirements) {
        this.setDietaryRequirements(dietaryRequirements);
        return this;
    }

    public Caterers addDietaryRequirements(DietaryRequirements dietaryRequirements) {
        this.dietaryRequirements.add(dietaryRequirements);
        dietaryRequirements.getCaterers().add(this);
        return this;
    }

    public Caterers removeDietaryRequirements(DietaryRequirements dietaryRequirements) {
        this.dietaryRequirements.remove(dietaryRequirements);
        dietaryRequirements.getCaterers().remove(this);
        return this;
    }

    public Set<Cuisine> getCuisines() {
        return this.cuisines;
    }

    public void setCuisines(Set<Cuisine> cuisines) {
        this.cuisines = cuisines;
    }

    public Caterers cuisines(Set<Cuisine> cuisines) {
        this.setCuisines(cuisines);
        return this;
    }

    public Caterers addCuisine(Cuisine cuisine) {
        this.cuisines.add(cuisine);
        cuisine.getCaterers().add(this);
        return this;
    }

    public Caterers removeCuisine(Cuisine cuisine) {
        this.cuisines.remove(cuisine);
        cuisine.getCaterers().remove(this);
        return this;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Caterers event(Event event) {
        this.setEvent(event);
        return this;
    }

    public Set<Rating> getRatings() {
        return this.ratings;
    }

    public void setRatings(Set<Rating> ratings) {
        if (this.ratings != null) {
            this.ratings.forEach(i -> i.setCaterers(null));
        }
        if (ratings != null) {
            ratings.forEach(i -> i.setCaterers(this));
        }
        this.ratings = ratings;
    }

    public Caterers ratings(Set<Rating> ratings) {
        this.setRatings(ratings);
        return this;
    }

    public Caterers addRating(Rating rating) {
        this.ratings.add(rating);
        rating.setCaterers(this);
        return this;
    }

    public Caterers removeRating(Rating rating) {
        this.ratings.remove(rating);
        rating.setCaterers(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Caterers)) {
            return false;
        }
        return id != null && id.equals(((Caterers) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Caterers{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", picture='" + getPicture() + "'" +
            ", pictureContentType='" + getPictureContentType() + "'" +
            ", pricePerPerson=" + getPricePerPerson() +
            ", guestLimit=" + getGuestLimit() +
            "}";
    }
}
