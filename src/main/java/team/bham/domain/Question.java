package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.QuesType;

/**
 * A Question.
 */
@Entity
@Table(name = "question")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Question implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "question", nullable = false)
    private String question;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "ques_type", nullable = false)
    private QuesType quesType;

    @OneToMany(mappedBy = "subQues")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "parentQues", "options", "questionnaire", "subQues" }, allowSetters = true)
    private Set<Question> parentQues = new HashSet<>();

    @OneToMany(mappedBy = "question")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "question" }, allowSetters = true)
    private Set<MCQOption> options = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "questionnaire", "questions" }, allowSetters = true)
    private Questionnaire questionnaire;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parentQues", "options", "questionnaire", "subQues" }, allowSetters = true)
    private Question subQues;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Question id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return this.question;
    }

    public Question question(String question) {
        this.setQuestion(question);
        return this;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public QuesType getQuesType() {
        return this.quesType;
    }

    public Question quesType(QuesType quesType) {
        this.setQuesType(quesType);
        return this;
    }

    public void setQuesType(QuesType quesType) {
        this.quesType = quesType;
    }

    public Set<Question> getParentQues() {
        return this.parentQues;
    }

    public void setParentQues(Set<Question> questions) {
        if (this.parentQues != null) {
            this.parentQues.forEach(i -> i.setSubQues(null));
        }
        if (questions != null) {
            questions.forEach(i -> i.setSubQues(this));
        }
        this.parentQues = questions;
    }

    public Question parentQues(Set<Question> questions) {
        this.setParentQues(questions);
        return this;
    }

    public Question addParentQues(Question question) {
        this.parentQues.add(question);
        question.setSubQues(this);
        return this;
    }

    public Question removeParentQues(Question question) {
        this.parentQues.remove(question);
        question.setSubQues(null);
        return this;
    }

    public Set<MCQOption> getOptions() {
        return this.options;
    }

    public void setOptions(Set<MCQOption> mCQOptions) {
        if (this.options != null) {
            this.options.forEach(i -> i.setQuestion(null));
        }
        if (mCQOptions != null) {
            mCQOptions.forEach(i -> i.setQuestion(this));
        }
        this.options = mCQOptions;
    }

    public Question options(Set<MCQOption> mCQOptions) {
        this.setOptions(mCQOptions);
        return this;
    }

    public Question addOptions(MCQOption mCQOption) {
        this.options.add(mCQOption);
        mCQOption.setQuestion(this);
        return this;
    }

    public Question removeOptions(MCQOption mCQOption) {
        this.options.remove(mCQOption);
        mCQOption.setQuestion(null);
        return this;
    }

    public Questionnaire getQuestionnaire() {
        return this.questionnaire;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
    }

    public Question questionnaire(Questionnaire questionnaire) {
        this.setQuestionnaire(questionnaire);
        return this;
    }

    public Question getSubQues() {
        return this.subQues;
    }

    public void setSubQues(Question question) {
        this.subQues = question;
    }

    public Question subQues(Question question) {
        this.setSubQues(question);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Question)) {
            return false;
        }
        return id != null && id.equals(((Question) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Question{" +
            "id=" + getId() +
            ", question='" + getQuestion() + "'" +
            ", quesType='" + getQuesType() + "'" +
            "}";
    }
}
