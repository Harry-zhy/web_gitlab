package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DecoSavedCompany.
 */
@Entity
@Table(name = "deco_saved_company")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DecoSavedCompany implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "decoSavedCompanies")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "decoContactDetails", "supplier", "decoSavedCompanies", "decoImages", "decoBudgets" },
        allowSetters = true
    )
    private Set<DecoCompany> decoCompanies = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DecoSavedCompany id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public DecoSavedCompany name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<DecoCompany> getDecoCompanies() {
        return this.decoCompanies;
    }

    public void setDecoCompanies(Set<DecoCompany> decoCompanies) {
        if (this.decoCompanies != null) {
            this.decoCompanies.forEach(i -> i.removeDecoSavedCompany(this));
        }
        if (decoCompanies != null) {
            decoCompanies.forEach(i -> i.addDecoSavedCompany(this));
        }
        this.decoCompanies = decoCompanies;
    }

    public DecoSavedCompany decoCompanies(Set<DecoCompany> decoCompanies) {
        this.setDecoCompanies(decoCompanies);
        return this;
    }

    public DecoSavedCompany addDecoCompany(DecoCompany decoCompany) {
        this.decoCompanies.add(decoCompany);
        decoCompany.getDecoSavedCompanies().add(this);
        return this;
    }

    public DecoSavedCompany removeDecoCompany(DecoCompany decoCompany) {
        this.decoCompanies.remove(decoCompany);
        decoCompany.getDecoSavedCompanies().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DecoSavedCompany)) {
            return false;
        }
        return id != null && id.equals(((DecoSavedCompany) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DecoSavedCompany{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
