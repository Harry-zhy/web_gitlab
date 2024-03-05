package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ActivityImage.
 */
@Entity
@Table(name = "activity_image")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ActivityImage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "picture")
    private byte[] picture;

    @Column(name = "picture_content_type")
    private String pictureContentType;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "supplier", "bookedActivity", "activityContactDetails", "activityImages", "ratings" },
        allowSetters = true
    )
    private ActivityCompany activityCompany;

    @ManyToOne
    @JsonIgnoreProperties(value = { "activitySaveds", "event", "activityIdeas", "activityImages", "ratings" }, allowSetters = true)
    private ActivitySelf activitySelf;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ActivityImage id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getPicture() {
        return this.picture;
    }

    public ActivityImage picture(byte[] picture) {
        this.setPicture(picture);
        return this;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public String getPictureContentType() {
        return this.pictureContentType;
    }

    public ActivityImage pictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
        return this;
    }

    public void setPictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
    }

    public ActivityCompany getActivityCompany() {
        return this.activityCompany;
    }

    public void setActivityCompany(ActivityCompany activityCompany) {
        this.activityCompany = activityCompany;
    }

    public ActivityImage activityCompany(ActivityCompany activityCompany) {
        this.setActivityCompany(activityCompany);
        return this;
    }

    public ActivitySelf getActivitySelf() {
        return this.activitySelf;
    }

    public void setActivitySelf(ActivitySelf activitySelf) {
        this.activitySelf = activitySelf;
    }

    public ActivityImage activitySelf(ActivitySelf activitySelf) {
        this.setActivitySelf(activitySelf);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActivityImage)) {
            return false;
        }
        return id != null && id.equals(((ActivityImage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActivityImage{" +
            "id=" + getId() +
            ", picture='" + getPicture() + "'" +
            ", pictureContentType='" + getPictureContentType() + "'" +
            "}";
    }
}
