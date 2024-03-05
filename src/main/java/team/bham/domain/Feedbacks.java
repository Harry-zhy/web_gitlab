package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Feedbacks.
 */
@Entity
@Table(name = "feedbacks")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Feedbacks implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private ZonedDateTime date;

    @NotNull
    @Column(name = "user_name", nullable = false)
    private String userName;

    @JsonIgnoreProperties(value = { "caterers", "activityCompany", "bookedActivity", "activitySelf" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Rating rating;

    @OneToMany(mappedBy = "feedbacks")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "feedbacks" }, allowSetters = true)
    private Set<OneFeedback> oneFeedbacks = new HashSet<>();

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

    public Feedbacks id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Feedbacks date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getUserName() {
        return this.userName;
    }

    public Feedbacks userName(String userName) {
        this.setUserName(userName);
        return this;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Rating getRating() {
        return this.rating;
    }

    public void setRating(Rating rating) {
        this.rating = rating;
    }

    public Feedbacks rating(Rating rating) {
        this.setRating(rating);
        return this;
    }

    public Set<OneFeedback> getOneFeedbacks() {
        return this.oneFeedbacks;
    }

    public void setOneFeedbacks(Set<OneFeedback> oneFeedbacks) {
        if (this.oneFeedbacks != null) {
            this.oneFeedbacks.forEach(i -> i.setFeedbacks(null));
        }
        if (oneFeedbacks != null) {
            oneFeedbacks.forEach(i -> i.setFeedbacks(this));
        }
        this.oneFeedbacks = oneFeedbacks;
    }

    public Feedbacks oneFeedbacks(Set<OneFeedback> oneFeedbacks) {
        this.setOneFeedbacks(oneFeedbacks);
        return this;
    }

    public Feedbacks addOneFeedback(OneFeedback oneFeedback) {
        this.oneFeedbacks.add(oneFeedback);
        oneFeedback.setFeedbacks(this);
        return this;
    }

    public Feedbacks removeOneFeedback(OneFeedback oneFeedback) {
        this.oneFeedbacks.remove(oneFeedback);
        oneFeedback.setFeedbacks(null);
        return this;
    }

    public Supplier getSupplier() {
        return this.supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Feedbacks supplier(Supplier supplier) {
        this.setSupplier(supplier);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Feedbacks)) {
            return false;
        }
        return id != null && id.equals(((Feedbacks) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Feedbacks{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", userName='" + getUserName() + "'" +
            "}";
    }
}
