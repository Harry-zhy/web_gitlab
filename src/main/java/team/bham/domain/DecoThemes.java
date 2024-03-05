package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DecoThemes.
 */
@Entity
@Table(name = "deco_themes")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DecoThemes implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "name")
    private String name;

    @ManyToMany
    @JoinTable(
        name = "rel_deco_themes__deco_saved_theme",
        joinColumns = @JoinColumn(name = "deco_themes_id"),
        inverseJoinColumns = @JoinColumn(name = "deco_saved_theme_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "decoThemes" }, allowSetters = true)
    private Set<DecoSavedTheme> decoSavedThemes = new HashSet<>();

    @OneToMany(mappedBy = "decoThemes")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "decoThemes", "decoCompany" }, allowSetters = true)
    private Set<DecoImages> decoImages = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DecoThemes id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public DecoThemes description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return this.name;
    }

    public DecoThemes name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<DecoSavedTheme> getDecoSavedThemes() {
        return this.decoSavedThemes;
    }

    public void setDecoSavedThemes(Set<DecoSavedTheme> decoSavedThemes) {
        this.decoSavedThemes = decoSavedThemes;
    }

    public DecoThemes decoSavedThemes(Set<DecoSavedTheme> decoSavedThemes) {
        this.setDecoSavedThemes(decoSavedThemes);
        return this;
    }

    public DecoThemes addDecoSavedTheme(DecoSavedTheme decoSavedTheme) {
        this.decoSavedThemes.add(decoSavedTheme);
        decoSavedTheme.getDecoThemes().add(this);
        return this;
    }

    public DecoThemes removeDecoSavedTheme(DecoSavedTheme decoSavedTheme) {
        this.decoSavedThemes.remove(decoSavedTheme);
        decoSavedTheme.getDecoThemes().remove(this);
        return this;
    }

    public Set<DecoImages> getDecoImages() {
        return this.decoImages;
    }

    public void setDecoImages(Set<DecoImages> decoImages) {
        if (this.decoImages != null) {
            this.decoImages.forEach(i -> i.setDecoThemes(null));
        }
        if (decoImages != null) {
            decoImages.forEach(i -> i.setDecoThemes(this));
        }
        this.decoImages = decoImages;
    }

    public DecoThemes decoImages(Set<DecoImages> decoImages) {
        this.setDecoImages(decoImages);
        return this;
    }

    public DecoThemes addDecoImages(DecoImages decoImages) {
        this.decoImages.add(decoImages);
        decoImages.setDecoThemes(this);
        return this;
    }

    public DecoThemes removeDecoImages(DecoImages decoImages) {
        this.decoImages.remove(decoImages);
        decoImages.setDecoThemes(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DecoThemes)) {
            return false;
        }
        return id != null && id.equals(((DecoThemes) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DecoThemes{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
