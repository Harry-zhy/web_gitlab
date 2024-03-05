package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DietaryRequirements.
 */
@Entity
@Table(name = "dietary_requirements")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DietaryRequirements implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "option")
    private String option;

    @ManyToMany(mappedBy = "dietaryRequirements")
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

    public DietaryRequirements id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOption() {
        return this.option;
    }

    public DietaryRequirements option(String option) {
        this.setOption(option);
        return this;
    }

    public void setOption(String option) {
        this.option = option;
    }

    public Set<Caterers> getCaterers() {
        return this.caterers;
    }

    public void setCaterers(Set<Caterers> caterers) {
        if (this.caterers != null) {
            this.caterers.forEach(i -> i.removeDietaryRequirements(this));
        }
        if (caterers != null) {
            caterers.forEach(i -> i.addDietaryRequirements(this));
        }
        this.caterers = caterers;
    }

    public DietaryRequirements caterers(Set<Caterers> caterers) {
        this.setCaterers(caterers);
        return this;
    }

    public DietaryRequirements addCaterers(Caterers caterers) {
        this.caterers.add(caterers);
        caterers.getDietaryRequirements().add(this);
        return this;
    }

    public DietaryRequirements removeCaterers(Caterers caterers) {
        this.caterers.remove(caterers);
        caterers.getDietaryRequirements().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DietaryRequirements)) {
            return false;
        }
        return id != null && id.equals(((DietaryRequirements) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DietaryRequirements{" +
            "id=" + getId() +
            ", option='" + getOption() + "'" +
            "}";
    }
}
