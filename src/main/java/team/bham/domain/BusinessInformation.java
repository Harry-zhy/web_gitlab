package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BusinessInformation.
 */
@Entity
@Table(name = "business_information")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BusinessInformation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "information")
    private String information;

    @Column(name = "business_hours")
    private String businessHours;

    @Column(name = "special_services_available")
    private String specialServicesAvailable;

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
            "src/main/webapp/app/caterers/caterers",
        },
        allowSetters = true
    )
    private Supplier supplier;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BusinessInformation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInformation() {
        return this.information;
    }

    public BusinessInformation information(String information) {
        this.setInformation(information);
        return this;
    }

    public void setInformation(String information) {
        this.information = information;
    }

    public String getBusinessHours() {
        return this.businessHours;
    }

    public BusinessInformation businessHours(String businessHours) {
        this.setBusinessHours(businessHours);
        return this;
    }

    public void setBusinessHours(String businessHours) {
        this.businessHours = businessHours;
    }

    public String getSpecialServicesAvailable() {
        return this.specialServicesAvailable;
    }

    public BusinessInformation specialServicesAvailable(String specialServicesAvailable) {
        this.setSpecialServicesAvailable(specialServicesAvailable);
        return this;
    }

    public void setSpecialServicesAvailable(String specialServicesAvailable) {
        this.specialServicesAvailable = specialServicesAvailable;
    }

    public Supplier getSupplier() {
        return this.supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public BusinessInformation supplier(Supplier supplier) {
        this.setSupplier(supplier);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BusinessInformation)) {
            return false;
        }
        return id != null && id.equals(((BusinessInformation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BusinessInformation{" +
            "id=" + getId() +
            ", information='" + getInformation() + "'" +
            ", businessHours='" + getBusinessHours() + "'" +
            ", specialServicesAvailable='" + getSpecialServicesAvailable() + "'" +
            "}";
    }
}
