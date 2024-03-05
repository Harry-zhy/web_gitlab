package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BookedCaterer.
 */
@Entity
@Table(name = "booked_caterer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BookedCaterer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "confirmation_status")
    private Boolean confirmationStatus;

    @ManyToOne
    @JsonIgnoreProperties(value = { "bookedCaterers" }, allowSetters = true)
    private Itinerary itinerary;

    @JsonIgnoreProperties(
        value = { "bookedCaterer", "eventItinerary", "supplier", "dietaryRequirements", "cuisines", "event", "ratings" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "bookedCaterer")
    private Caterers caterers;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BookedCaterer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getConfirmationStatus() {
        return this.confirmationStatus;
    }

    public BookedCaterer confirmationStatus(Boolean confirmationStatus) {
        this.setConfirmationStatus(confirmationStatus);
        return this;
    }

    public void setConfirmationStatus(Boolean confirmationStatus) {
        this.confirmationStatus = confirmationStatus;
    }

    public Itinerary getItinerary() {
        return this.itinerary;
    }

    public void setItinerary(Itinerary itinerary) {
        this.itinerary = itinerary;
    }

    public BookedCaterer itinerary(Itinerary itinerary) {
        this.setItinerary(itinerary);
        return this;
    }

    public Caterers getCaterers() {
        return this.caterers;
    }

    public void setCaterers(Caterers caterers) {
        if (this.caterers != null) {
            this.caterers.setBookedCaterer(null);
        }
        if (caterers != null) {
            caterers.setBookedCaterer(this);
        }
        this.caterers = caterers;
    }

    public BookedCaterer caterers(Caterers caterers) {
        this.setCaterers(caterers);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BookedCaterer)) {
            return false;
        }
        return id != null && id.equals(((BookedCaterer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BookedCaterer{" +
            "id=" + getId() +
            ", confirmationStatus='" + getConfirmationStatus() + "'" +
            "}";
    }
}
