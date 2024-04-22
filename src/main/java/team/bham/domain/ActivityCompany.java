package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.Length;

/**
 * A ActivityCompany.
 */
@Entity
@Table(name = "activity_company")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ActivityCompany implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Length(max = 1000)
    @Column(name = "about")
    private String about;

    @JsonIgnoreProperties(
        value = {
            "feedbacks",
            "venueInformations",
            "adsManagements",
            "businessInformations",
            "activityCompany",
            "decoCompany",
            "notification",
            "src/main/webapp/app/caterers/caterers",
        },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private Supplier supplier;

    @ManyToOne
    @JsonIgnoreProperties(value = { "activitySaveds", "activityCompanies", "ratings" }, allowSetters = true)
    private BookedActivity bookedActivity;

    @JsonIgnoreProperties(value = { "activityCompany" }, allowSetters = true)
    @OneToOne(mappedBy = "activityCompany")
    private ActivityContactDetails activityContactDetails;

    @OneToMany(mappedBy = "activityCompany")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "activityCompany", "activitySelf" }, allowSetters = true)
    private Set<ActivityImage> activityImages = new HashSet<>();

    @OneToMany(mappedBy = "activityCompany")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "src/main/webapp/app/caterers/caterers", "activityCompany", "bookedActivity", "activitySelf" },
        allowSetters = true
    )
    private Set<Rating> ratings = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ActivityCompany id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ActivityCompany name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAbout() {
        return this.about;
    }

    public ActivityCompany about(String about) {
        this.setAbout(about);
        return this;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public Supplier getSupplier() {
        return this.supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public ActivityCompany supplier(Supplier supplier) {
        this.setSupplier(supplier);
        return this;
    }

    public BookedActivity getBookedActivity() {
        return this.bookedActivity;
    }

    public void setBookedActivity(BookedActivity bookedActivity) {
        this.bookedActivity = bookedActivity;
    }

    public ActivityCompany bookedActivity(BookedActivity bookedActivity) {
        this.setBookedActivity(bookedActivity);
        return this;
    }

    public ActivityContactDetails getActivityContactDetails() {
        return this.activityContactDetails;
    }

    public void setActivityContactDetails(ActivityContactDetails activityContactDetails) {
        if (this.activityContactDetails != null) {
            this.activityContactDetails.setActivityCompany(null);
        }
        if (activityContactDetails != null) {
            activityContactDetails.setActivityCompany(this);
        }
        this.activityContactDetails = activityContactDetails;
    }

    public ActivityCompany activityContactDetails(ActivityContactDetails activityContactDetails) {
        this.setActivityContactDetails(activityContactDetails);
        return this;
    }

    public Set<ActivityImage> getActivityImages() {
        return this.activityImages;
    }

    public void setActivityImages(Set<ActivityImage> activityImages) {
        if (this.activityImages != null) {
            this.activityImages.forEach(i -> i.setActivityCompany(null));
        }
        if (activityImages != null) {
            activityImages.forEach(i -> i.setActivityCompany(this));
        }
        this.activityImages = activityImages;
    }

    public ActivityCompany activityImages(Set<ActivityImage> activityImages) {
        this.setActivityImages(activityImages);
        return this;
    }

    public ActivityCompany addActivityImage(ActivityImage activityImage) {
        this.activityImages.add(activityImage);
        activityImage.setActivityCompany(this);
        return this;
    }

    public ActivityCompany removeActivityImage(ActivityImage activityImage) {
        this.activityImages.remove(activityImage);
        activityImage.setActivityCompany(null);
        return this;
    }

    public Set<Rating> getRatings() {
        return this.ratings;
    }

    public void setRatings(Set<Rating> ratings) {
        if (this.ratings != null) {
            this.ratings.forEach(i -> i.setActivityCompany(null));
        }
        if (ratings != null) {
            ratings.forEach(i -> i.setActivityCompany(this));
        }
        this.ratings = ratings;
    }

    public ActivityCompany ratings(Set<Rating> ratings) {
        this.setRatings(ratings);
        return this;
    }

    public ActivityCompany addRating(Rating rating) {
        this.ratings.add(rating);
        rating.setActivityCompany(this);
        return this;
    }

    public ActivityCompany removeRating(Rating rating) {
        this.ratings.remove(rating);
        rating.setActivityCompany(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActivityCompany)) {
            return false;
        }
        return id != null && id.equals(((ActivityCompany) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActivityCompany{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", about='" + getAbout() + "'" +
            "}";
    }
}
