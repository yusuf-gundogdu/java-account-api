package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DiscountUsage.
 */
@Entity
@Table(name = "discount_usage")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DiscountUsage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private String id;

    @Column(name = "usage_date")
    private Instant usageDate;

    @Column(name = "total_discount_amount")
    private Float totalDiscountAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public DiscountUsage id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getUsageDate() {
        return this.usageDate;
    }

    public DiscountUsage usageDate(Instant usageDate) {
        this.setUsageDate(usageDate);
        return this;
    }

    public void setUsageDate(Instant usageDate) {
        this.usageDate = usageDate;
    }

    public Float getTotalDiscountAmount() {
        return this.totalDiscountAmount;
    }

    public DiscountUsage totalDiscountAmount(Float totalDiscountAmount) {
        this.setTotalDiscountAmount(totalDiscountAmount);
        return this;
    }

    public void setTotalDiscountAmount(Float totalDiscountAmount) {
        this.totalDiscountAmount = totalDiscountAmount;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public DiscountUsage user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DiscountUsage)) {
            return false;
        }
        return getId() != null && getId().equals(((DiscountUsage) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DiscountUsage{" +
            "id=" + getId() +
            ", usageDate='" + getUsageDate() + "'" +
            ", totalDiscountAmount=" + getTotalDiscountAmount() +
            "}";
    }
}
