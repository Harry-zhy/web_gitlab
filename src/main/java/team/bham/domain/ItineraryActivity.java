package team.bham.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ItineraryActivity.
 */
@Entity
@Table(name = "itinerary_activity")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ItineraryActivity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "activity_name")
    private String activityName;

    @Column(name = "activity_cost")
    private Float activityCost;

    @Column(name = "activity_host")
    private String activityHost;

    @Column(name = "activity_time")
    private ZonedDateTime activityTime;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ItineraryActivity id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActivityName() {
        return this.activityName;
    }

    public ItineraryActivity activityName(String activityName) {
        this.setActivityName(activityName);
        return this;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public Float getActivityCost() {
        return this.activityCost;
    }

    public ItineraryActivity activityCost(Float activityCost) {
        this.setActivityCost(activityCost);
        return this;
    }

    public void setActivityCost(Float activityCost) {
        this.activityCost = activityCost;
    }

    public String getActivityHost() {
        return this.activityHost;
    }

    public ItineraryActivity activityHost(String activityHost) {
        this.setActivityHost(activityHost);
        return this;
    }

    public void setActivityHost(String activityHost) {
        this.activityHost = activityHost;
    }

    public ZonedDateTime getActivityTime() {
        return this.activityTime;
    }

    public ItineraryActivity activityTime(ZonedDateTime activityTime) {
        this.setActivityTime(activityTime);
        return this;
    }

    public void setActivityTime(ZonedDateTime activityTime) {
        this.activityTime = activityTime;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ItineraryActivity)) {
            return false;
        }
        return id != null && id.equals(((ItineraryActivity) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ItineraryActivity{" +
            "id=" + getId() +
            ", activityName='" + getActivityName() + "'" +
            ", activityCost=" + getActivityCost() +
            ", activityHost='" + getActivityHost() + "'" +
            ", activityTime='" + getActivityTime() + "'" +
            "}";
    }
}
