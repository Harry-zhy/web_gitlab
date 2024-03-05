package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DecoSavedTheme.
 */
@Entity
@Table(name = "deco_saved_theme")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DecoSavedTheme implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "decoSavedThemes")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "decoSavedThemes", "decoImages" }, allowSetters = true)
    private Set<DecoThemes> decoThemes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DecoSavedTheme id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public DecoSavedTheme name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<DecoThemes> getDecoThemes() {
        return this.decoThemes;
    }

    public void setDecoThemes(Set<DecoThemes> decoThemes) {
        if (this.decoThemes != null) {
            this.decoThemes.forEach(i -> i.removeDecoSavedTheme(this));
        }
        if (decoThemes != null) {
            decoThemes.forEach(i -> i.addDecoSavedTheme(this));
        }
        this.decoThemes = decoThemes;
    }

    public DecoSavedTheme decoThemes(Set<DecoThemes> decoThemes) {
        this.setDecoThemes(decoThemes);
        return this;
    }

    public DecoSavedTheme addDecoThemes(DecoThemes decoThemes) {
        this.decoThemes.add(decoThemes);
        decoThemes.getDecoSavedThemes().add(this);
        return this;
    }

    public DecoSavedTheme removeDecoThemes(DecoThemes decoThemes) {
        this.decoThemes.remove(decoThemes);
        decoThemes.getDecoSavedThemes().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DecoSavedTheme)) {
            return false;
        }
        return id != null && id.equals(((DecoSavedTheme) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DecoSavedTheme{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
