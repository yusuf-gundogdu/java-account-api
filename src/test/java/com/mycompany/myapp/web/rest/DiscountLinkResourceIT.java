package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.DiscountLinkAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.DiscountLink;
import com.mycompany.myapp.repository.DiscountLinkRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DiscountLinkResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DiscountLinkResourceIT {

    private static final Float DEFAULT_DISCOUNT_AMOUNT = 1F;
    private static final Float UPDATED_DISCOUNT_AMOUNT = 2F;

    private static final Float DEFAULT_ACCOUNTED_PRICE = 1F;
    private static final Float UPDATED_ACCOUNTED_PRICE = 2F;

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/discount-links";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DiscountLinkRepository discountLinkRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDiscountLinkMockMvc;

    private DiscountLink discountLink;

    private DiscountLink insertedDiscountLink;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DiscountLink createEntity() {
        return new DiscountLink().discountAmount(DEFAULT_DISCOUNT_AMOUNT).accountedPrice(DEFAULT_ACCOUNTED_PRICE).date(DEFAULT_DATE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DiscountLink createUpdatedEntity() {
        return new DiscountLink().discountAmount(UPDATED_DISCOUNT_AMOUNT).accountedPrice(UPDATED_ACCOUNTED_PRICE).date(UPDATED_DATE);
    }

    @BeforeEach
    public void initTest() {
        discountLink = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedDiscountLink != null) {
            discountLinkRepository.delete(insertedDiscountLink);
            insertedDiscountLink = null;
        }
    }

    @Test
    @Transactional
    void createDiscountLink() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the DiscountLink
        var returnedDiscountLink = om.readValue(
            restDiscountLinkMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(discountLink)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            DiscountLink.class
        );

        // Validate the DiscountLink in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertDiscountLinkUpdatableFieldsEquals(returnedDiscountLink, getPersistedDiscountLink(returnedDiscountLink));

        insertedDiscountLink = returnedDiscountLink;
    }

    @Test
    @Transactional
    void createDiscountLinkWithExistingId() throws Exception {
        // Create the DiscountLink with an existing ID
        discountLink.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDiscountLinkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(discountLink)))
            .andExpect(status().isBadRequest());

        // Validate the DiscountLink in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDiscountLinks() throws Exception {
        // Initialize the database
        insertedDiscountLink = discountLinkRepository.saveAndFlush(discountLink);

        // Get all the discountLinkList
        restDiscountLinkMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(discountLink.getId())))
            .andExpect(jsonPath("$.[*].discountAmount").value(hasItem(DEFAULT_DISCOUNT_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].accountedPrice").value(hasItem(DEFAULT_ACCOUNTED_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getDiscountLink() throws Exception {
        // Initialize the database
        insertedDiscountLink = discountLinkRepository.saveAndFlush(discountLink);

        // Get the discountLink
        restDiscountLinkMockMvc
            .perform(get(ENTITY_API_URL_ID, discountLink.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(discountLink.getId()))
            .andExpect(jsonPath("$.discountAmount").value(DEFAULT_DISCOUNT_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.accountedPrice").value(DEFAULT_ACCOUNTED_PRICE.doubleValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDiscountLink() throws Exception {
        // Get the discountLink
        restDiscountLinkMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDiscountLink() throws Exception {
        // Initialize the database
        insertedDiscountLink = discountLinkRepository.saveAndFlush(discountLink);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the discountLink
        DiscountLink updatedDiscountLink = discountLinkRepository.findById(discountLink.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDiscountLink are not directly saved in db
        em.detach(updatedDiscountLink);
        updatedDiscountLink.discountAmount(UPDATED_DISCOUNT_AMOUNT).accountedPrice(UPDATED_ACCOUNTED_PRICE).date(UPDATED_DATE);

        restDiscountLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDiscountLink.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedDiscountLink))
            )
            .andExpect(status().isOk());

        // Validate the DiscountLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDiscountLinkToMatchAllProperties(updatedDiscountLink);
    }

    @Test
    @Transactional
    void putNonExistingDiscountLink() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discountLink.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiscountLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, discountLink.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(discountLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the DiscountLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDiscountLink() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discountLink.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscountLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(discountLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the DiscountLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDiscountLink() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discountLink.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscountLinkMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(discountLink)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DiscountLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDiscountLinkWithPatch() throws Exception {
        // Initialize the database
        insertedDiscountLink = discountLinkRepository.saveAndFlush(discountLink);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the discountLink using partial update
        DiscountLink partialUpdatedDiscountLink = new DiscountLink();
        partialUpdatedDiscountLink.setId(discountLink.getId());

        partialUpdatedDiscountLink.accountedPrice(UPDATED_ACCOUNTED_PRICE).date(UPDATED_DATE);

        restDiscountLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiscountLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDiscountLink))
            )
            .andExpect(status().isOk());

        // Validate the DiscountLink in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDiscountLinkUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedDiscountLink, discountLink),
            getPersistedDiscountLink(discountLink)
        );
    }

    @Test
    @Transactional
    void fullUpdateDiscountLinkWithPatch() throws Exception {
        // Initialize the database
        insertedDiscountLink = discountLinkRepository.saveAndFlush(discountLink);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the discountLink using partial update
        DiscountLink partialUpdatedDiscountLink = new DiscountLink();
        partialUpdatedDiscountLink.setId(discountLink.getId());

        partialUpdatedDiscountLink.discountAmount(UPDATED_DISCOUNT_AMOUNT).accountedPrice(UPDATED_ACCOUNTED_PRICE).date(UPDATED_DATE);

        restDiscountLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiscountLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDiscountLink))
            )
            .andExpect(status().isOk());

        // Validate the DiscountLink in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDiscountLinkUpdatableFieldsEquals(partialUpdatedDiscountLink, getPersistedDiscountLink(partialUpdatedDiscountLink));
    }

    @Test
    @Transactional
    void patchNonExistingDiscountLink() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discountLink.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiscountLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, discountLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(discountLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the DiscountLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDiscountLink() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discountLink.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscountLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(discountLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the DiscountLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDiscountLink() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discountLink.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscountLinkMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(discountLink)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DiscountLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDiscountLink() throws Exception {
        // Initialize the database
        insertedDiscountLink = discountLinkRepository.saveAndFlush(discountLink);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the discountLink
        restDiscountLinkMockMvc
            .perform(delete(ENTITY_API_URL_ID, discountLink.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return discountLinkRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected DiscountLink getPersistedDiscountLink(DiscountLink discountLink) {
        return discountLinkRepository.findById(discountLink.getId()).orElseThrow();
    }

    protected void assertPersistedDiscountLinkToMatchAllProperties(DiscountLink expectedDiscountLink) {
        assertDiscountLinkAllPropertiesEquals(expectedDiscountLink, getPersistedDiscountLink(expectedDiscountLink));
    }

    protected void assertPersistedDiscountLinkToMatchUpdatableProperties(DiscountLink expectedDiscountLink) {
        assertDiscountLinkAllUpdatablePropertiesEquals(expectedDiscountLink, getPersistedDiscountLink(expectedDiscountLink));
    }
}
