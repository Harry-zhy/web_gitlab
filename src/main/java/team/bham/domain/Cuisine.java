package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Cuisine.
 */
@Entity
@Table(name = "cuisine")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Cuisine implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "region")
    private String region;

    @ManyToMany(mappedBy = "cuisines")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "bookedCaterer", "eventItinerary", "supplier", "dietaryRequirements", "cuisines", "event", "ratings" },
        allowSetters = true
    )
    private Set<Caterers> caterers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Cuisine id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRegion() {
        return this.region;
    }

    public Cuisine region(String region) {
        this.setRegion(region);
        return this;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public Set<Caterers> getCaterers() {
        return this.caterers;
    }

    public void setCaterers(Set<Caterers> caterers) {
        if (this.caterers != null) {
            this.caterers.forEach(i -> i.removeCuisine(this));
        }
        if (caterers != null) {
            caterers.forEach(i -> i.addCuisine(this));
        }
        this.caterers = caterers;
    }

    public Cuisine caterers(Set<Caterers> caterers) {
        this.setCaterers(caterers);
        return this;
    }

    public Cuisine addCaterers(Caterers caterers) {
        this.caterers.add(caterers);
        caterers.getCuisines().add(this);
        return this;
    }

    public Cuisine removeCaterers(Caterers caterers) {
        this.caterers.remove(caterers);
        caterers.getCuisines().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cuisine)) {
            return false;
        }
        return id != null && id.equals(((Cuisine) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cuisine{" +
            "id=" + getId() +
            ", region='" + getRegion() + "'" +
            "}";
    }
}
