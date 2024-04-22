package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.Length;

/**
 * A ActivityIdea.
 */
@Entity
@Table(name = "activity_idea")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ActivityIdea implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Length(max = 1000)
    @Column(name = "description", nullable = false, length = 1000)
    private String description;

    @Column(name = "link")
    private String link;

    @ManyToOne
    @JsonIgnoreProperties(value = { "activitySaveds", "event", "activityIdeas", "activityImages", "ratings" }, allowSetters = true)
    private ActivitySelf activitySelf;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ActivityIdea id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public ActivityIdea description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLink() {
        return this.link;
    }

    public ActivityIdea link(String link) {
        this.setLink(link);
        return this;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public ActivitySelf getActivitySelf() {
        return this.activitySelf;
    }

    public void setActivitySelf(ActivitySelf activitySelf) {
        this.activitySelf = activitySelf;
    }

    public ActivityIdea activitySelf(ActivitySelf activitySelf) {
        this.setActivitySelf(activitySelf);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActivityIdea)) {
            return false;
        }
        return id != null && id.equals(((ActivityIdea) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActivityIdea{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", link='" + getLink() + "'" +
            "}";
    }
}
