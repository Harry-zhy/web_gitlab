package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.Category;

/**
 * A FavouritesListItem.
 */
@Entity
@Table(name = "favourites_list_item")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FavouritesListItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private Category category;

    @Column(name = "description")
    private String description;

    @JsonIgnoreProperties(
        value = { "bookedCaterer", "eventItinerary", "supplier", "dietaryRequirements", "cuisines", "event", "ratings" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private Caterers caterer;

    @JsonIgnoreProperties(value = { "activitySaveds", "event", "activityIdeas", "activityImages", "ratings" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private ActivitySelf activity;

    @JsonIgnoreProperties(value = { "eventItinerary", "supplier" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private VenueInformation venue;

    @ManyToOne
    @JsonIgnoreProperties(value = { "favourites" }, allowSetters = true)
    private FavouritesList favouritesList;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FavouritesListItem id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public FavouritesListItem name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Category getCategory() {
        return this.category;
    }

    public FavouritesListItem category(Category category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getDescription() {
        return this.description;
    }

    public FavouritesListItem description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Caterers getCaterer() {
        return this.caterer;
    }

    public void setCaterer(Caterers caterers) {
        this.caterer = caterers;
    }

    public FavouritesListItem caterer(Caterers caterers) {
        this.setCaterer(caterers);
        return this;
    }

    public ActivitySelf getActivity() {
        return this.activity;
    }

    public void setActivity(ActivitySelf activitySelf) {
        this.activity = activitySelf;
    }

    public FavouritesListItem activity(ActivitySelf activitySelf) {
        this.setActivity(activitySelf);
        return this;
    }

    public VenueInformation getVenue() {
        return this.venue;
    }

    public void setVenue(VenueInformation venueInformation) {
        this.venue = venueInformation;
    }

    public FavouritesListItem venue(VenueInformation venueInformation) {
        this.setVenue(venueInformation);
        return this;
    }

    public FavouritesList getFavouritesList() {
        return this.favouritesList;
    }

    public void setFavouritesList(FavouritesList favouritesList) {
        this.favouritesList = favouritesList;
    }

    public FavouritesListItem favouritesList(FavouritesList favouritesList) {
        this.setFavouritesList(favouritesList);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FavouritesListItem)) {
            return false;
        }
        return id != null && id.equals(((FavouritesListItem) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FavouritesListItem{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", category='" + getCategory() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
