package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ActivityContactDetails.
 */
@Entity
@Table(name = "activity_contact_details")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ActivityContactDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "website")
    private String website;

    @Column(name = "twitter")
    private String twitter;

    @Column(name = "instagram")
    private String instagram;

    @Column(name = "facebook")
    private String facebook;

    @Column(name = "tiktok")
    private String tiktok;

    @Column(name = "phone_number")
    private String phoneNumber;

    @JsonIgnoreProperties(
        value = { "supplier", "bookedActivity", "activityContactDetails", "activityImages", "ratings" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private ActivityCompany activityCompany;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ActivityContactDetails id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWebsite() {
        return this.website;
    }

    public ActivityContactDetails website(String website) {
        this.setWebsite(website);
        return this;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getTwitter() {
        return this.twitter;
    }

    public ActivityContactDetails twitter(String twitter) {
        this.setTwitter(twitter);
        return this;
    }

    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }

    public String getInstagram() {
        return this.instagram;
    }

    public ActivityContactDetails instagram(String instagram) {
        this.setInstagram(instagram);
        return this;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    public String getFacebook() {
        return this.facebook;
    }

    public ActivityContactDetails facebook(String facebook) {
        this.setFacebook(facebook);
        return this;
    }

    public void setFacebook(String facebook) {
        this.facebook = facebook;
    }

    public String getTiktok() {
        return this.tiktok;
    }

    public ActivityContactDetails tiktok(String tiktok) {
        this.setTiktok(tiktok);
        return this;
    }

    public void setTiktok(String tiktok) {
        this.tiktok = tiktok;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public ActivityContactDetails phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public ActivityCompany getActivityCompany() {
        return this.activityCompany;
    }

    public void setActivityCompany(ActivityCompany activityCompany) {
        this.activityCompany = activityCompany;
    }

    public ActivityContactDetails activityCompany(ActivityCompany activityCompany) {
        this.setActivityCompany(activityCompany);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActivityContactDetails)) {
            return false;
        }
        return id != null && id.equals(((ActivityContactDetails) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActivityContactDetails{" +
            "id=" + getId() +
            ", website='" + getWebsite() + "'" +
            ", twitter='" + getTwitter() + "'" +
            ", instagram='" + getInstagram() + "'" +
            ", facebook='" + getFacebook() + "'" +
            ", tiktok='" + getTiktok() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            "}";
    }
}
