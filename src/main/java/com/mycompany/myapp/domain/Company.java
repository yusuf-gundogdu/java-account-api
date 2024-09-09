package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Company.
 */
@Entity
@Table(name = "company")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Company implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "rating")
    private Float rating;

    @Column(name = "discount_percentage")
    private Float discountPercentage;

    @Column(name = "advertising")
    private Boolean advertising;

    @Column(name = "discount_active")
    private Boolean discountActive;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Company id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Company name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return this.address;
    }

    public Company address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Float getRating() {
        return this.rating;
    }

    public Company rating(Float rating) {
        this.setRating(rating);
        return this;
    }

    public void setRating(Float rating) {
        this.rating = rating;
    }

    public Float getDiscountPercentage() {
        return this.discountPercentage;
    }

    public Company discountPercentage(Float discountPercentage) {
        this.setDiscountPercentage(discountPercentage);
        return this;
    }

    public void setDiscountPercentage(Float discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public Boolean getAdvertising() {
        return this.advertising;
    }

    public Company advertising(Boolean advertising) {
        this.setAdvertising(advertising);
        return this;
    }

    public void setAdvertising(Boolean advertising) {
        this.advertising = advertising;
    }

    public Boolean getDiscountActive() {
        return this.discountActive;
    }

    public Company discountActive(Boolean discountActive) {
        this.setDiscountActive(discountActive);
        return this;
    }

    public void setDiscountActive(Boolean discountActive) {
        this.discountActive = discountActive;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Company)) {
            return false;
        }
        return getId() != null && getId().equals(((Company) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Company{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", address='" + getAddress() + "'" +
            ", rating=" + getRating() +
            ", discountPercentage=" + getDiscountPercentage() +
            ", advertising='" + getAdvertising() + "'" +
            ", discountActive='" + getDiscountActive() + "'" +
            "}";
    }
}
