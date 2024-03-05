package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Supplier.
 */
@Entity
@Table(name = "supplier")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Supplier implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "is_supplier")
    private Boolean isSupplier;

    @OneToMany(mappedBy = "supplier")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rating", "oneFeedbacks", "supplier" }, allowSetters = true)
    private Set<Feedbacks> feedbacks = new HashSet<>();

    @OneToMany(mappedBy = "supplier")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "eventItinerary", "supplier" }, allowSetters = true)
    private Set<VenueInformation> venueInformations = new HashSet<>();

    @OneToMany(mappedBy = "supplier")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "supplier" }, allowSetters = true)
    private Set<AdsManagement> adsManagements = new HashSet<>();

    @OneToMany(mappedBy = "supplier")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "supplier" }, allowSetters = true)
    private Set<BusinessInformation> businessInformations = new HashSet<>();

    @JsonIgnoreProperties(
        value = { "supplier", "bookedActivity", "activityContactDetails", "activityImages", "ratings" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "supplier")
    private ActivityCompany activityCompany;

    @JsonIgnoreProperties(
        value = { "decoContactDetails", "supplier", "decoSavedCompanies", "decoImages", "decoBudgets" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "supplier")
    private DecoCompany decoCompany;

    @JsonIgnoreProperties(value = { "supplier", "message" }, allowSetters = true)
    @OneToOne(mappedBy = "supplier")
    private Notification notification;

    @OneToMany(mappedBy = "supplier")
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

    public Supplier id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsSupplier() {
        return this.isSupplier;
    }

    public Supplier isSupplier(Boolean isSupplier) {
        this.setIsSupplier(isSupplier);
        return this;
    }

    public void setIsSupplier(Boolean isSupplier) {
        this.isSupplier = isSupplier;
    }

    public Set<Feedbacks> getFeedbacks() {
        return this.feedbacks;
    }

    public void setFeedbacks(Set<Feedbacks> feedbacks) {
        if (this.feedbacks != null) {
            this.feedbacks.forEach(i -> i.setSupplier(null));
        }
        if (feedbacks != null) {
            feedbacks.forEach(i -> i.setSupplier(this));
        }
        this.feedbacks = feedbacks;
    }

    public Supplier feedbacks(Set<Feedbacks> feedbacks) {
        this.setFeedbacks(feedbacks);
        return this;
    }

    public Supplier addFeedbacks(Feedbacks feedbacks) {
        this.feedbacks.add(feedbacks);
        feedbacks.setSupplier(this);
        return this;
    }

    public Supplier removeFeedbacks(Feedbacks feedbacks) {
        this.feedbacks.remove(feedbacks);
        feedbacks.setSupplier(null);
        return this;
    }

    public Set<VenueInformation> getVenueInformations() {
        return this.venueInformations;
    }

    public void setVenueInformations(Set<VenueInformation> venueInformations) {
        if (this.venueInformations != null) {
            this.venueInformations.forEach(i -> i.setSupplier(null));
        }
        if (venueInformations != null) {
            venueInformations.forEach(i -> i.setSupplier(this));
        }
        this.venueInformations = venueInformations;
    }

    public Supplier venueInformations(Set<VenueInformation> venueInformations) {
        this.setVenueInformations(venueInformations);
        return this;
    }

    public Supplier addVenueInformation(VenueInformation venueInformation) {
        this.venueInformations.add(venueInformation);
        venueInformation.setSupplier(this);
        return this;
    }

    public Supplier removeVenueInformation(VenueInformation venueInformation) {
        this.venueInformations.remove(venueInformation);
        venueInformation.setSupplier(null);
        return this;
    }

    public Set<AdsManagement> getAdsManagements() {
        return this.adsManagements;
    }

    public void setAdsManagements(Set<AdsManagement> adsManagements) {
        if (this.adsManagements != null) {
            this.adsManagements.forEach(i -> i.setSupplier(null));
        }
        if (adsManagements != null) {
            adsManagements.forEach(i -> i.setSupplier(this));
        }
        this.adsManagements = adsManagements;
    }

    public Supplier adsManagements(Set<AdsManagement> adsManagements) {
        this.setAdsManagements(adsManagements);
        return this;
    }

    public Supplier addAdsManagement(AdsManagement adsManagement) {
        this.adsManagements.add(adsManagement);
        adsManagement.setSupplier(this);
        return this;
    }

    public Supplier removeAdsManagement(AdsManagement adsManagement) {
        this.adsManagements.remove(adsManagement);
        adsManagement.setSupplier(null);
        return this;
    }

    public Set<BusinessInformation> getBusinessInformations() {
        return this.businessInformations;
    }

    public void setBusinessInformations(Set<BusinessInformation> businessInformations) {
        if (this.businessInformations != null) {
            this.businessInformations.forEach(i -> i.setSupplier(null));
        }
        if (businessInformations != null) {
            businessInformations.forEach(i -> i.setSupplier(this));
        }
        this.businessInformations = businessInformations;
    }

    public Supplier businessInformations(Set<BusinessInformation> businessInformations) {
        this.setBusinessInformations(businessInformations);
        return this;
    }

    public Supplier addBusinessInformation(BusinessInformation businessInformation) {
        this.businessInformations.add(businessInformation);
        businessInformation.setSupplier(this);
        return this;
    }

    public Supplier removeBusinessInformation(BusinessInformation businessInformation) {
        this.businessInformations.remove(businessInformation);
        businessInformation.setSupplier(null);
        return this;
    }

    public ActivityCompany getActivityCompany() {
        return this.activityCompany;
    }

    public void setActivityCompany(ActivityCompany activityCompany) {
        if (this.activityCompany != null) {
            this.activityCompany.setSupplier(null);
        }
        if (activityCompany != null) {
            activityCompany.setSupplier(this);
        }
        this.activityCompany = activityCompany;
    }

    public Supplier activityCompany(ActivityCompany activityCompany) {
        this.setActivityCompany(activityCompany);
        return this;
    }

    public DecoCompany getDecoCompany() {
        return this.decoCompany;
    }

    public void setDecoCompany(DecoCompany decoCompany) {
        if (this.decoCompany != null) {
            this.decoCompany.setSupplier(null);
        }
        if (decoCompany != null) {
            decoCompany.setSupplier(this);
        }
        this.decoCompany = decoCompany;
    }

    public Supplier decoCompany(DecoCompany decoCompany) {
        this.setDecoCompany(decoCompany);
        return this;
    }

    public Notification getNotification() {
        return this.notification;
    }

    public void setNotification(Notification notification) {
        if (this.notification != null) {
            this.notification.setSupplier(null);
        }
        if (notification != null) {
            notification.setSupplier(this);
        }
        this.notification = notification;
    }

    public Supplier notification(Notification notification) {
        this.setNotification(notification);
        return this;
    }

    public Set<Caterers> getCaterers() {
        return this.caterers;
    }

    public void setCaterers(Set<Caterers> caterers) {
        if (this.caterers != null) {
            this.caterers.forEach(i -> i.setSupplier(null));
        }
        if (caterers != null) {
            caterers.forEach(i -> i.setSupplier(this));
        }
        this.caterers = caterers;
    }

    public Supplier caterers(Set<Caterers> caterers) {
        this.setCaterers(caterers);
        return this;
    }

    public Supplier addCaterers(Caterers caterers) {
        this.caterers.add(caterers);
        caterers.setSupplier(this);
        return this;
    }

    public Supplier removeCaterers(Caterers caterers) {
        this.caterers.remove(caterers);
        caterers.setSupplier(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Supplier)) {
            return false;
        }
        return id != null && id.equals(((Supplier) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Supplier{" +
            "id=" + getId() +
            ", isSupplier='" + getIsSupplier() + "'" +
            "}";
    }
}
