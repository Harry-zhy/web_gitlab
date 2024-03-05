package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Questionnaire.
 */
@Entity
@Table(name = "questionnaire")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Questionnaire implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private ZonedDateTime date;

    @NotNull
    @Column(name = "user_name", nullable = false)
    private String userName;

    @OneToOne
    @JoinColumn(unique = true)
    private Intro questionnaire;

    @OneToMany(mappedBy = "questionnaire")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "parentQues", "options", "questionnaire", "subQues" }, allowSetters = true)
    private Set<Question> questions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Questionnaire id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Questionnaire date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getUserName() {
        return this.userName;
    }

    public Questionnaire userName(String userName) {
        this.setUserName(userName);
        return this;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Intro getQuestionnaire() {
        return this.questionnaire;
    }

    public void setQuestionnaire(Intro intro) {
        this.questionnaire = intro;
    }

    public Questionnaire questionnaire(Intro intro) {
        this.setQuestionnaire(intro);
        return this;
    }

    public Set<Question> getQuestions() {
        return this.questions;
    }

    public void setQuestions(Set<Question> questions) {
        if (this.questions != null) {
            this.questions.forEach(i -> i.setQuestionnaire(null));
        }
        if (questions != null) {
            questions.forEach(i -> i.setQuestionnaire(this));
        }
        this.questions = questions;
    }

    public Questionnaire questions(Set<Question> questions) {
        this.setQuestions(questions);
        return this;
    }

    public Questionnaire addQuestions(Question question) {
        this.questions.add(question);
        question.setQuestionnaire(this);
        return this;
    }

    public Questionnaire removeQuestions(Question question) {
        this.questions.remove(question);
        question.setQuestionnaire(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Questionnaire)) {
            return false;
        }
        return id != null && id.equals(((Questionnaire) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Questionnaire{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", userName='" + getUserName() + "'" +
            "}";
    }
}
