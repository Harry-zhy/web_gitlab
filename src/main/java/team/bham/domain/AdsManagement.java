package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AdsManagement.
 */
@Entity
@Table(name = "ads_management")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AdsManagement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender")
    private String gender;

    @Column(name = "preference")
    private String preference;

    @Column(name = "location")
    private String location;

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

    public AdsManagement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getAge() {
        return this.age;
    }

    public AdsManagement age(Integer age) {
        this.setAge(age);
        return this;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return this.gender;
    }

    public AdsManagement gender(String gender) {
        this.setGender(gender);
        return this;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPreference() {
        return this.preference;
    }

    public AdsManagement preference(String preference) {
        this.setPreference(preference);
        return this;
    }

    public void setPreference(String preference) {
        this.preference = preference;
    }

    public String getLocation() {
        return this.location;
    }

    public AdsManagement location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Supplier getSupplier() {
        return this.supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public AdsManagement supplier(Supplier supplier) {
        this.setSupplier(supplier);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AdsManagement)) {
            return false;
        }
        return id != null && id.equals(((AdsManagement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdsManagement{" +
            "id=" + getId() +
            ", age=" + getAge() +
            ", gender='" + getGender() + "'" +
            ", preference='" + getPreference() + "'" +
            ", location='" + getLocation() + "'" +
            "}";
    }
}
