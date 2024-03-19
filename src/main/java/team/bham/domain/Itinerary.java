package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Itinerary.
 */
@Entity
@Table(name = "itinerary")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Itinerary implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "start_time")
    private ZonedDateTime startTime;

    @Column(name = "end_time")
    private ZonedDateTime endTime;

    @Column(name = "location")
    private String location;

    @OneToMany(mappedBy = "itinerary")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "itinerary", "src/main/webapp/app/caterers/caterers" }, allowSetters = true)
    private Set<BookedCaterer> bookedCaterers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Itinerary id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getStartTime() {
        return this.startTime;
    }

    public Itinerary startTime(ZonedDateTime startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(ZonedDateTime startTime) {
        this.startTime = startTime;
    }

    public ZonedDateTime getEndTime() {
        return this.endTime;
    }

    public Itinerary endTime(ZonedDateTime endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(ZonedDateTime endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return this.location;
    }

    public Itinerary location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Set<BookedCaterer> getBookedCaterers() {
        return this.bookedCaterers;
    }

    public void setBookedCaterers(Set<BookedCaterer> bookedCaterers) {
        if (this.bookedCaterers != null) {
            this.bookedCaterers.forEach(i -> i.setItinerary(null));
        }
        if (bookedCaterers != null) {
            bookedCaterers.forEach(i -> i.setItinerary(this));
        }
        this.bookedCaterers = bookedCaterers;
    }

    public Itinerary bookedCaterers(Set<BookedCaterer> bookedCaterers) {
        this.setBookedCaterers(bookedCaterers);
        return this;
    }

    public Itinerary addBookedCaterer(BookedCaterer bookedCaterer) {
        this.bookedCaterers.add(bookedCaterer);
        bookedCaterer.setItinerary(this);
        return this;
    }

    public Itinerary removeBookedCaterer(BookedCaterer bookedCaterer) {
        this.bookedCaterers.remove(bookedCaterer);
        bookedCaterer.setItinerary(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Itinerary)) {
            return false;
        }
        return id != null && id.equals(((Itinerary) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Itinerary{" +
            "id=" + getId() +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            ", location='" + getLocation() + "'" +
            "}";
    }
}
