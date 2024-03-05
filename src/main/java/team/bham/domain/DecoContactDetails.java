package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DecoContactDetails.
 */
@Entity
@Table(name = "deco_contact_details")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DecoContactDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "website")
    private String website;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "instagram")
    private String instagram;

    @Column(name = "twitter")
    private String twitter;

    @Column(name = "facebook")
    private String facebook;

    @Column(name = "tiktok")
    private String tiktok;

    @JsonIgnoreProperties(
        value = { "decoContactDetails", "supplier", "decoSavedCompanies", "decoImages", "decoBudgets" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "decoContactDetails")
    private DecoCompany decoCompany;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DecoContactDetails id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWebsite() {
        return this.website;
    }

    public DecoContactDetails website(String website) {
        this.setWebsite(website);
        return this;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public DecoContactDetails phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getInstagram() {
        return this.instagram;
    }

    public DecoContactDetails instagram(String instagram) {
        this.setInstagram(instagram);
        return this;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    public String getTwitter() {
        return this.twitter;
    }

    public DecoContactDetails twitter(String twitter) {
        this.setTwitter(twitter);
        return this;
    }

    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }

    public String getFacebook() {
        return this.facebook;
    }

    public DecoContactDetails facebook(String facebook) {
        this.setFacebook(facebook);
        return this;
    }

    public void setFacebook(String facebook) {
        this.facebook = facebook;
    }

    public String getTiktok() {
        return this.tiktok;
    }

    public DecoContactDetails tiktok(String tiktok) {
        this.setTiktok(tiktok);
        return this;
    }

    public void setTiktok(String tiktok) {
        this.tiktok = tiktok;
    }

    public DecoCompany getDecoCompany() {
        return this.decoCompany;
    }

    public void setDecoCompany(DecoCompany decoCompany) {
        if (this.decoCompany != null) {
            this.decoCompany.setDecoContactDetails(null);
        }
        if (decoCompany != null) {
            decoCompany.setDecoContactDetails(this);
        }
        this.decoCompany = decoCompany;
    }

    public DecoContactDetails decoCompany(DecoCompany decoCompany) {
        this.setDecoCompany(decoCompany);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DecoContactDetails)) {
            return false;
        }
        return id != null && id.equals(((DecoContactDetails) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DecoContactDetails{" +
            "id=" + getId() +
            ", website='" + getWebsite() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", instagram='" + getInstagram() + "'" +
            ", twitter='" + getTwitter() + "'" +
            ", facebook='" + getFacebook() + "'" +
            ", tiktok='" + getTiktok() + "'" +
            "}";
    }
}
