package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DecoCompany.
 */
@Entity
@Table(name = "deco_company")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DecoCompany implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "about")
    private String about;

    @Column(name = "rating")
    private Integer rating;

    @JsonIgnoreProperties(value = { "decoCompany" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private DecoContactDetails decoContactDetails;

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

    @ManyToMany
    @JoinTable(
        name = "rel_deco_company__deco_saved_company",
        joinColumns = @JoinColumn(name = "deco_company_id"),
        inverseJoinColumns = @JoinColumn(name = "deco_saved_company_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "decoCompanies" }, allowSetters = true)
    private Set<DecoSavedCompany> decoSavedCompanies = new HashSet<>();

    @OneToMany(mappedBy = "decoCompany")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "decoThemes", "decoCompany" }, allowSetters = true)
    private Set<DecoImages> decoImages = new HashSet<>();

    @ManyToMany(mappedBy = "decoCompanies")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "decoCompanies" }, allowSetters = true)
    private Set<DecoBudget> decoBudgets = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DecoCompany id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public DecoCompany name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAbout() {
        return this.about;
    }

    public DecoCompany about(String about) {
        this.setAbout(about);
        return this;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public Integer getRating() {
        return this.rating;
    }

    public DecoCompany rating(Integer rating) {
        this.setRating(rating);
        return this;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public DecoContactDetails getDecoContactDetails() {
        return this.decoContactDetails;
    }

    public void setDecoContactDetails(DecoContactDetails decoContactDetails) {
        this.decoContactDetails = decoContactDetails;
    }

    public DecoCompany decoContactDetails(DecoContactDetails decoContactDetails) {
        this.setDecoContactDetails(decoContactDetails);
        return this;
    }

    public Supplier getSupplier() {
        return this.supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public DecoCompany supplier(Supplier supplier) {
        this.setSupplier(supplier);
        return this;
    }

    public Set<DecoSavedCompany> getDecoSavedCompanies() {
        return this.decoSavedCompanies;
    }

    public void setDecoSavedCompanies(Set<DecoSavedCompany> decoSavedCompanies) {
        this.decoSavedCompanies = decoSavedCompanies;
    }

    public DecoCompany decoSavedCompanies(Set<DecoSavedCompany> decoSavedCompanies) {
        this.setDecoSavedCompanies(decoSavedCompanies);
        return this;
    }

    public DecoCompany addDecoSavedCompany(DecoSavedCompany decoSavedCompany) {
        this.decoSavedCompanies.add(decoSavedCompany);
        decoSavedCompany.getDecoCompanies().add(this);
        return this;
    }

    public DecoCompany removeDecoSavedCompany(DecoSavedCompany decoSavedCompany) {
        this.decoSavedCompanies.remove(decoSavedCompany);
        decoSavedCompany.getDecoCompanies().remove(this);
        return this;
    }

    public Set<DecoImages> getDecoImages() {
        return this.decoImages;
    }

    public void setDecoImages(Set<DecoImages> decoImages) {
        if (this.decoImages != null) {
            this.decoImages.forEach(i -> i.setDecoCompany(null));
        }
        if (decoImages != null) {
            decoImages.forEach(i -> i.setDecoCompany(this));
        }
        this.decoImages = decoImages;
    }

    public DecoCompany decoImages(Set<DecoImages> decoImages) {
        this.setDecoImages(decoImages);
        return this;
    }

    public DecoCompany addDecoImages(DecoImages decoImages) {
        this.decoImages.add(decoImages);
        decoImages.setDecoCompany(this);
        return this;
    }

    public DecoCompany removeDecoImages(DecoImages decoImages) {
        this.decoImages.remove(decoImages);
        decoImages.setDecoCompany(null);
        return this;
    }

    public Set<DecoBudget> getDecoBudgets() {
        return this.decoBudgets;
    }

    public void setDecoBudgets(Set<DecoBudget> decoBudgets) {
        if (this.decoBudgets != null) {
            this.decoBudgets.forEach(i -> i.removeDecoCompany(this));
        }
        if (decoBudgets != null) {
            decoBudgets.forEach(i -> i.addDecoCompany(this));
        }
        this.decoBudgets = decoBudgets;
    }

    public DecoCompany decoBudgets(Set<DecoBudget> decoBudgets) {
        this.setDecoBudgets(decoBudgets);
        return this;
    }

    public DecoCompany addDecoBudget(DecoBudget decoBudget) {
        this.decoBudgets.add(decoBudget);
        decoBudget.getDecoCompanies().add(this);
        return this;
    }

    public DecoCompany removeDecoBudget(DecoBudget decoBudget) {
        this.decoBudgets.remove(decoBudget);
        decoBudget.getDecoCompanies().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DecoCompany)) {
            return false;
        }
        return id != null && id.equals(((DecoCompany) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DecoCompany{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", about='" + getAbout() + "'" +
            ", rating=" + getRating() +
            "}";
    }
}
