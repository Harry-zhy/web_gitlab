package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OneFeedback.
 */
@Entity
@Table(name = "one_feedback")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OneFeedback implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "content", nullable = false)
    private String content;

    @NotNull
    @Column(name = "with_multi_media", nullable = false)
    private Boolean withMultiMedia;

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "video_path")
    private String videoPath;

    @ManyToOne
    @JsonIgnoreProperties(value = { "rating", "oneFeedbacks", "supplier" }, allowSetters = true)
    private Feedbacks feedbacks;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OneFeedback id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return this.content;
    }

    public OneFeedback content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getWithMultiMedia() {
        return this.withMultiMedia;
    }

    public OneFeedback withMultiMedia(Boolean withMultiMedia) {
        this.setWithMultiMedia(withMultiMedia);
        return this;
    }

    public void setWithMultiMedia(Boolean withMultiMedia) {
        this.withMultiMedia = withMultiMedia;
    }

    public String getImagePath() {
        return this.imagePath;
    }

    public OneFeedback imagePath(String imagePath) {
        this.setImagePath(imagePath);
        return this;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getVideoPath() {
        return this.videoPath;
    }

    public OneFeedback videoPath(String videoPath) {
        this.setVideoPath(videoPath);
        return this;
    }

    public void setVideoPath(String videoPath) {
        this.videoPath = videoPath;
    }

    public Feedbacks getFeedbacks() {
        return this.feedbacks;
    }

    public void setFeedbacks(Feedbacks feedbacks) {
        this.feedbacks = feedbacks;
    }

    public OneFeedback feedbacks(Feedbacks feedbacks) {
        this.setFeedbacks(feedbacks);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OneFeedback)) {
            return false;
        }
        return id != null && id.equals(((OneFeedback) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OneFeedback{" +
            "id=" + getId() +
            ", content='" + getContent() + "'" +
            ", withMultiMedia='" + getWithMultiMedia() + "'" +
            ", imagePath='" + getImagePath() + "'" +
            ", videoPath='" + getVideoPath() + "'" +
            "}";
    }
}
