package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DecoBudget.
 */
@Entity
@Table(name = "deco_budget")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DecoBudget implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "money")
    private Integer money;

    @ManyToMany
    @JoinTable(
        name = "rel_deco_budget__deco_company",
        joinColumns = @JoinColumn(name = "deco_budget_id"),
        inverseJoinColumns = @JoinColumn(name = "deco_company_id")
    )
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

    public DecoBudget id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMoney() {
        return this.money;
    }

    public DecoBudget money(Integer money) {
        this.setMoney(money);
        return this;
    }

    public void setMoney(Integer money) {
        this.money = money;
    }

    public Set<DecoCompany> getDecoCompanies() {
        return this.decoCompanies;
    }

    public void setDecoCompanies(Set<DecoCompany> decoCompanies) {
        this.decoCompanies = decoCompanies;
    }

    public DecoBudget decoCompanies(Set<DecoCompany> decoCompanies) {
        this.setDecoCompanies(decoCompanies);
        return this;
    }

    public DecoBudget addDecoCompany(DecoCompany decoCompany) {
        this.decoCompanies.add(decoCompany);
        decoCompany.getDecoBudgets().add(this);
        return this;
    }

    public DecoBudget removeDecoCompany(DecoCompany decoCompany) {
        this.decoCompanies.remove(decoCompany);
        decoCompany.getDecoBudgets().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DecoBudget)) {
            return false;
        }
        return id != null && id.equals(((DecoBudget) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DecoBudget{" +
            "id=" + getId() +
            ", money=" + getMoney() +
            "}";
    }
}
