package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FavouritesList.
 */
@Entity
@Table(name = "favourites_list")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FavouritesList implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @OneToMany(mappedBy = "favouritesList")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "caterer", "activity", "venue", "favouritesList" }, allowSetters = true)
    private Set<FavouritesListItem> favourites = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FavouritesList id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<FavouritesListItem> getFavourites() {
        return this.favourites;
    }

    public void setFavourites(Set<FavouritesListItem> favouritesListItems) {
        if (this.favourites != null) {
            this.favourites.forEach(i -> i.setFavouritesList(null));
        }
        if (favouritesListItems != null) {
            favouritesListItems.forEach(i -> i.setFavouritesList(this));
        }
        this.favourites = favouritesListItems;
    }

    public FavouritesList favourites(Set<FavouritesListItem> favouritesListItems) {
        this.setFavourites(favouritesListItems);
        return this;
    }

    public FavouritesList addFavourites(FavouritesListItem favouritesListItem) {
        this.favourites.add(favouritesListItem);
        favouritesListItem.setFavouritesList(this);
        return this;
    }

    public FavouritesList removeFavourites(FavouritesListItem favouritesListItem) {
        this.favourites.remove(favouritesListItem);
        favouritesListItem.setFavouritesList(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FavouritesList)) {
            return false;
        }
        return id != null && id.equals(((FavouritesList) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FavouritesList{" +
            "id=" + getId() +
            "}";
    }
}
