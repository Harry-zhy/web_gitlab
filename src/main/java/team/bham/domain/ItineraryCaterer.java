package team.bham.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ItineraryCaterer.
 */
@Entity
@Table(name = "itinerary_caterer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ItineraryCaterer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "caterer_name")
    private String catererName;

    @Column(name = "caterer_cost")
    private Float catererCost;

    @Column(name = "caterer_host")
    private String catererHost;

    @Column(name = "caterer_time")
    private ZonedDateTime catererTime;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ItineraryCaterer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCatererName() {
        return this.catererName;
    }

    public ItineraryCaterer catererName(String catererName) {
        this.setCatererName(catererName);
        return this;
    }

    public void setCatererName(String catererName) {
        this.catererName = catererName;
    }

    public Float getCatererCost() {
        return this.catererCost;
    }

    public ItineraryCaterer catererCost(Float catererCost) {
        this.setCatererCost(catererCost);
        return this;
    }

    public void setCatererCost(Float catererCost) {
        this.catererCost = catererCost;
    }

    public String getCatererHost() {
        return this.catererHost;
    }

    public ItineraryCaterer catererHost(String catererHost) {
        this.setCatererHost(catererHost);
        return this;
    }

    public void setCatererHost(String catererHost) {
        this.catererHost = catererHost;
    }

    public ZonedDateTime getCatererTime() {
        return this.catererTime;
    }

    public ItineraryCaterer catererTime(ZonedDateTime catererTime) {
        this.setCatererTime(catererTime);
        return this;
    }

    public void setCatererTime(ZonedDateTime catererTime) {
        this.catererTime = catererTime;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ItineraryCaterer)) {
            return false;
        }
        return id != null && id.equals(((ItineraryCaterer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ItineraryCaterer{" +
            "id=" + getId() +
            ", catererName='" + getCatererName() + "'" +
            ", catererCost=" + getCatererCost() +
            ", catererHost='" + getCatererHost() + "'" +
            ", catererTime='" + getCatererTime() + "'" +
            "}";
    }
}
