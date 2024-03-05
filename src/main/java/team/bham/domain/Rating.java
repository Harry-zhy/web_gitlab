package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Rating.
 */
@Entity
@Table(name = "rating")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Rating implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "value", nullable = false)
    private Integer value;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "bookedCaterer", "eventItinerary", "supplier", "dietaryRequirements", "cuisines", "event", "ratings" },
        allowSetters = true
    )
    private Caterers caterers;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "supplier", "bookedActivity", "activityContactDetails", "activityImages", "ratings" },
        allowSetters = true
    )
    private ActivityCompany activityCompany;

    @ManyToOne
    @JsonIgnoreProperties(value = { "activitySaveds", "activityCompanies", "ratings" }, allowSetters = true)
    private BookedActivity bookedActivity;

    @ManyToOne
    @JsonIgnoreProperties(value = { "activitySaveds", "event", "activityIdeas", "activityImages", "ratings" }, allowSetters = true)
    private ActivitySelf activitySelf;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Rating id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getValue() {
        return this.value;
    }

    public Rating value(Integer value) {
        this.setValue(value);
        return this;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public Caterers getCaterers() {
        return this.caterers;
    }

    public void setCaterers(Caterers caterers) {
        this.caterers = caterers;
    }

    public Rating caterers(Caterers caterers) {
        this.setCaterers(caterers);
        return this;
    }

    public ActivityCompany getActivityCompany() {
        return this.activityCompany;
    }

    public void setActivityCompany(ActivityCompany activityCompany) {
        this.activityCompany = activityCompany;
    }

    public Rating activityCompany(ActivityCompany activityCompany) {
        this.setActivityCompany(activityCompany);
        return this;
    }

    public BookedActivity getBookedActivity() {
        return this.bookedActivity;
    }

    public void setBookedActivity(BookedActivity bookedActivity) {
        this.bookedActivity = bookedActivity;
    }

    public Rating bookedActivity(BookedActivity bookedActivity) {
        this.setBookedActivity(bookedActivity);
        return this;
    }

    public ActivitySelf getActivitySelf() {
        return this.activitySelf;
    }

    public void setActivitySelf(ActivitySelf activitySelf) {
        this.activitySelf = activitySelf;
    }

    public Rating activitySelf(ActivitySelf activitySelf) {
        this.setActivitySelf(activitySelf);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Rating)) {
            return false;
        }
        return id != null && id.equals(((Rating) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Rating{" +
            "id=" + getId() +
            ", value=" + getValue() +
            "}";
    }
}
