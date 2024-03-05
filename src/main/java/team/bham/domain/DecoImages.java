package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DecoImages.
 */
@Entity
@Table(name = "deco_images")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DecoImages implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "picture", nullable = false)
    private byte[] picture;

    @NotNull
    @Column(name = "picture_content_type", nullable = false)
    private String pictureContentType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "decoSavedThemes", "decoImages" }, allowSetters = true)
    private DecoThemes decoThemes;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "decoContactDetails", "supplier", "decoSavedCompanies", "decoImages", "decoBudgets" },
        allowSetters = true
    )
    private DecoCompany decoCompany;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DecoImages id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getPicture() {
        return this.picture;
    }

    public DecoImages picture(byte[] picture) {
        this.setPicture(picture);
        return this;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public String getPictureContentType() {
        return this.pictureContentType;
    }

    public DecoImages pictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
        return this;
    }

    public void setPictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
    }

    public DecoThemes getDecoThemes() {
        return this.decoThemes;
    }

    public void setDecoThemes(DecoThemes decoThemes) {
        this.decoThemes = decoThemes;
    }

    public DecoImages decoThemes(DecoThemes decoThemes) {
        this.setDecoThemes(decoThemes);
        return this;
    }

    public DecoCompany getDecoCompany() {
        return this.decoCompany;
    }

    public void setDecoCompany(DecoCompany decoCompany) {
        this.decoCompany = decoCompany;
    }

    public DecoImages decoCompany(DecoCompany decoCompany) {
        this.setDecoCompany(decoCompany);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DecoImages)) {
            return false;
        }
        return id != null && id.equals(((DecoImages) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DecoImages{" +
            "id=" + getId() +
            ", picture='" + getPicture() + "'" +
            ", pictureContentType='" + getPictureContentType() + "'" +
            "}";
    }
}
