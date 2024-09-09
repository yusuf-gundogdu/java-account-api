package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.DiscountUsageAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.DiscountUsage;
import com.mycompany.myapp.repository.DiscountUsageRepository;
import com.mycompany.myapp.repository.UserRepository;
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
 * Integration tests for the {@link DiscountUsageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DiscountUsageResourceIT {

    private static final Instant DEFAULT_USAGE_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_USAGE_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Float DEFAULT_TOTAL_DISCOUNT_AMOUNT = 1F;
    private static final Float UPDATED_TOTAL_DISCOUNT_AMOUNT = 2F;

    private static final String ENTITY_API_URL = "/api/discount-usages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DiscountUsageRepository discountUsageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDiscountUsageMockMvc;

    private DiscountUsage discountUsage;

    private DiscountUsage insertedDiscountUsage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DiscountUsage createEntity() {
        return new DiscountUsage().usageDate(DEFAULT_USAGE_DATE).totalDiscountAmount(DEFAULT_TOTAL_DISCOUNT_AMOUNT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DiscountUsage createUpdatedEntity() {
        return new DiscountUsage().usageDate(UPDATED_USAGE_DATE).totalDiscountAmount(UPDATED_TOTAL_DISCOUNT_AMOUNT);
    }

    @BeforeEach
    public void initTest() {
        discountUsage = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedDiscountUsage != null) {
            discountUsageRepository.delete(insertedDiscountUsage);
            insertedDiscountUsage = null;
        }
    }

    @Test
    @Transactional
    void createDiscountUsage() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the DiscountUsage
        var returnedDiscountUsage = om.readValue(
            restDiscountUsageMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(discountUsage)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            DiscountUsage.class
        );

        // Validate the DiscountUsage in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertDiscountUsageUpdatableFieldsEquals(returnedDiscountUsage, getPersistedDiscountUsage(returnedDiscountUsage));

        insertedDiscountUsage = returnedDiscountUsage;
    }

    @Test
    @Transactional
    void createDiscountUsageWithExistingId() throws Exception {
        // Create the DiscountUsage with an existing ID
        discountUsage.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDiscountUsageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(discountUsage)))
            .andExpect(status().isBadRequest());

        // Validate the DiscountUsage in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDiscountUsages() throws Exception {
        // Initialize the database
        insertedDiscountUsage = discountUsageRepository.saveAndFlush(discountUsage);

        // Get all the discountUsageList
        restDiscountUsageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(discountUsage.getId())))
            .andExpect(jsonPath("$.[*].usageDate").value(hasItem(DEFAULT_USAGE_DATE.toString())))
            .andExpect(jsonPath("$.[*].totalDiscountAmount").value(hasItem(DEFAULT_TOTAL_DISCOUNT_AMOUNT.doubleValue())));
    }

    @Test
    @Transactional
    void getDiscountUsage() throws Exception {
        // Initialize the database
        insertedDiscountUsage = discountUsageRepository.saveAndFlush(discountUsage);

        // Get the discountUsage
        restDiscountUsageMockMvc
            .perform(get(ENTITY_API_URL_ID, discountUsage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(discountUsage.getId()))
            .andExpect(jsonPath("$.usageDate").value(DEFAULT_USAGE_DATE.toString()))
            .andExpect(jsonPath("$.totalDiscountAmount").value(DEFAULT_TOTAL_DISCOUNT_AMOUNT.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingDiscountUsage() throws Exception {
        // Get the discountUsage
        restDiscountUsageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDiscountUsage() throws Exception {
        // Initialize the database
        insertedDiscountUsage = discountUsageRepository.saveAndFlush(discountUsage);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the discountUsage
        DiscountUsage updatedDiscountUsage = discountUsageRepository.findById(discountUsage.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDiscountUsage are not directly saved in db
        em.detach(updatedDiscountUsage);
        updatedDiscountUsage.usageDate(UPDATED_USAGE_DATE).totalDiscountAmount(UPDATED_TOTAL_DISCOUNT_AMOUNT);

        restDiscountUsageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDiscountUsage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedDiscountUsage))
            )
            .andExpect(status().isOk());

        // Validate the DiscountUsage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDiscountUsageToMatchAllProperties(updatedDiscountUsage);
    }

    @Test
    @Transactional
    void putNonExistingDiscountUsage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discountUsage.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiscountUsageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, discountUsage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(discountUsage))
            )
            .andExpect(status().isBadRequest());

        // Validate the DiscountUsage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDiscountUsage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discountUsage.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscountUsageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(discountUsage))
            )
            .andExpect(status().isBadRequest());

        // Validate the DiscountUsage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDiscountUsage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discountUsage.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscountUsageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(discountUsage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DiscountUsage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDiscountUsageWithPatch() throws Exception {
        // Initialize the database
        insertedDiscountUsage = discountUsageRepository.saveAndFlush(discountUsage);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the discountUsage using partial update
        DiscountUsage partialUpdatedDiscountUsage = new DiscountUsage();
        partialUpdatedDiscountUsage.setId(discountUsage.getId());

        restDiscountUsageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiscountUsage.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDiscountUsage))
            )
            .andExpect(status().isOk());

        // Validate the DiscountUsage in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDiscountUsageUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedDiscountUsage, discountUsage),
            getPersistedDiscountUsage(discountUsage)
        );
    }

    @Test
    @Transactional
    void fullUpdateDiscountUsageWithPatch() throws Exception {
        // Initialize the database
        insertedDiscountUsage = discountUsageRepository.saveAndFlush(discountUsage);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the discountUsage using partial update
        DiscountUsage partialUpdatedDiscountUsage = new DiscountUsage();
        partialUpdatedDiscountUsage.setId(discountUsage.getId());

        partialUpdatedDiscountUsage.usageDate(UPDATED_USAGE_DATE).totalDiscountAmount(UPDATED_TOTAL_DISCOUNT_AMOUNT);

        restDiscountUsageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiscountUsage.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDiscountUsage))
            )
            .andExpect(status().isOk());

        // Validate the DiscountUsage in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDiscountUsageUpdatableFieldsEquals(partialUpdatedDiscountUsage, getPersistedDiscountUsage(partialUpdatedDiscountUsage));
    }

    @Test
    @Transactional
    void patchNonExistingDiscountUsage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discountUsage.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiscountUsageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, discountUsage.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(discountUsage))
            )
            .andExpect(status().isBadRequest());

        // Validate the DiscountUsage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDiscountUsage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discountUsage.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscountUsageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(discountUsage))
            )
            .andExpect(status().isBadRequest());

        // Validate the DiscountUsage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDiscountUsage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discountUsage.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscountUsageMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(discountUsage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DiscountUsage in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDiscountUsage() throws Exception {
        // Initialize the database
        insertedDiscountUsage = discountUsageRepository.saveAndFlush(discountUsage);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the discountUsage
        restDiscountUsageMockMvc
            .perform(delete(ENTITY_API_URL_ID, discountUsage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return discountUsageRepository.count();
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

    protected DiscountUsage getPersistedDiscountUsage(DiscountUsage discountUsage) {
        return discountUsageRepository.findById(discountUsage.getId()).orElseThrow();
    }

    protected void assertPersistedDiscountUsageToMatchAllProperties(DiscountUsage expectedDiscountUsage) {
        assertDiscountUsageAllPropertiesEquals(expectedDiscountUsage, getPersistedDiscountUsage(expectedDiscountUsage));
    }

    protected void assertPersistedDiscountUsageToMatchUpdatableProperties(DiscountUsage expectedDiscountUsage) {
        assertDiscountUsageAllUpdatablePropertiesEquals(expectedDiscountUsage, getPersistedDiscountUsage(expectedDiscountUsage));
    }
}
