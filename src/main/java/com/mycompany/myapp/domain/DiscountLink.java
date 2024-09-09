package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DiscountLink.
 */
@Entity
@Table(name = "discount_link")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DiscountLink implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private String id;

    @Column(name = "discount_amount")
    private Float discountAmount;

    @Column(name = "accounted_price")
    private Float accountedPrice;

    @Column(name = "date")
    private Instant date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private DiscountUsage discountUsage;

    @ManyToOne(fetch = FetchType.LAZY)
    private Company company;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public DiscountLink id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Float getDiscountAmount() {
        return this.discountAmount;
    }

    public DiscountLink discountAmount(Float discountAmount) {
        this.setDiscountAmount(discountAmount);
        return this;
    }

    public void setDiscountAmount(Float discountAmount) {
        this.discountAmount = discountAmount;
    }

    public Float getAccountedPrice() {
        return this.accountedPrice;
    }

    public DiscountLink accountedPrice(Float accountedPrice) {
        this.setAccountedPrice(accountedPrice);
        return this;
    }

    public void setAccountedPrice(Float accountedPrice) {
        this.accountedPrice = accountedPrice;
    }

    public Instant getDate() {
        return this.date;
    }

    public DiscountLink date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public DiscountUsage getDiscountUsage() {
        return this.discountUsage;
    }

    public void setDiscountUsage(DiscountUsage discountUsage) {
        this.discountUsage = discountUsage;
    }

    public DiscountLink discountUsage(DiscountUsage discountUsage) {
        this.setDiscountUsage(discountUsage);
        return this;
    }

    public Company getCompany() {
        return this.company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public DiscountLink company(Company company) {
        this.setCompany(company);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DiscountLink)) {
            return false;
        }
        return getId() != null && getId().equals(((DiscountLink) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DiscountLink{" +
            "id=" + getId() +
            ", discountAmount=" + getDiscountAmount() +
            ", accountedPrice=" + getAccountedPrice() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
