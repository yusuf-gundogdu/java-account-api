package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.UserRatingAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.UserRating;
import com.mycompany.myapp.repository.UserRatingRepository;
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
 * Integration tests for the {@link UserRatingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserRatingResourceIT {

    private static final Float DEFAULT_RATING = 1F;
    private static final Float UPDATED_RATING = 2F;

    private static final Instant DEFAULT_REVIEW_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_REVIEW_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/user-ratings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private UserRatingRepository userRatingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserRatingMockMvc;

    private UserRating userRating;

    private UserRating insertedUserRating;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserRating createEntity() {
        return new UserRating().rating(DEFAULT_RATING).reviewDate(DEFAULT_REVIEW_DATE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserRating createUpdatedEntity() {
        return new UserRating().rating(UPDATED_RATING).reviewDate(UPDATED_REVIEW_DATE);
    }

    @BeforeEach
    public void initTest() {
        userRating = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedUserRating != null) {
            userRatingRepository.delete(insertedUserRating);
            insertedUserRating = null;
        }
    }

    @Test
    @Transactional
    void createUserRating() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the UserRating
        var returnedUserRating = om.readValue(
            restUserRatingMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userRating)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            UserRating.class
        );

        // Validate the UserRating in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertUserRatingUpdatableFieldsEquals(returnedUserRating, getPersistedUserRating(returnedUserRating));

        insertedUserRating = returnedUserRating;
    }

    @Test
    @Transactional
    void createUserRatingWithExistingId() throws Exception {
        // Create the UserRating with an existing ID
        userRating.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserRatingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userRating)))
            .andExpect(status().isBadRequest());

        // Validate the UserRating in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserRatings() throws Exception {
        // Initialize the database
        insertedUserRating = userRatingRepository.saveAndFlush(userRating);

        // Get all the userRatingList
        restUserRatingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userRating.getId())))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING.doubleValue())))
            .andExpect(jsonPath("$.[*].reviewDate").value(hasItem(DEFAULT_REVIEW_DATE.toString())));
    }

    @Test
    @Transactional
    void getUserRating() throws Exception {
        // Initialize the database
        insertedUserRating = userRatingRepository.saveAndFlush(userRating);

        // Get the userRating
        restUserRatingMockMvc
            .perform(get(ENTITY_API_URL_ID, userRating.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userRating.getId()))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING.doubleValue()))
            .andExpect(jsonPath("$.reviewDate").value(DEFAULT_REVIEW_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingUserRating() throws Exception {
        // Get the userRating
        restUserRatingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserRating() throws Exception {
        // Initialize the database
        insertedUserRating = userRatingRepository.saveAndFlush(userRating);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the userRating
        UserRating updatedUserRating = userRatingRepository.findById(userRating.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedUserRating are not directly saved in db
        em.detach(updatedUserRating);
        updatedUserRating.rating(UPDATED_RATING).reviewDate(UPDATED_REVIEW_DATE);

        restUserRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserRating.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedUserRating))
            )
            .andExpect(status().isOk());

        // Validate the UserRating in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedUserRatingToMatchAllProperties(updatedUserRating);
    }

    @Test
    @Transactional
    void putNonExistingUserRating() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userRating.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userRating.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserRating in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserRating() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userRating.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(userRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserRating in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserRating() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userRating.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserRatingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userRating)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserRating in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserRatingWithPatch() throws Exception {
        // Initialize the database
        insertedUserRating = userRatingRepository.saveAndFlush(userRating);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the userRating using partial update
        UserRating partialUpdatedUserRating = new UserRating();
        partialUpdatedUserRating.setId(userRating.getId());

        partialUpdatedUserRating.rating(UPDATED_RATING).reviewDate(UPDATED_REVIEW_DATE);

        restUserRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserRating.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUserRating))
            )
            .andExpect(status().isOk());

        // Validate the UserRating in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUserRatingUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedUserRating, userRating),
            getPersistedUserRating(userRating)
        );
    }

    @Test
    @Transactional
    void fullUpdateUserRatingWithPatch() throws Exception {
        // Initialize the database
        insertedUserRating = userRatingRepository.saveAndFlush(userRating);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the userRating using partial update
        UserRating partialUpdatedUserRating = new UserRating();
        partialUpdatedUserRating.setId(userRating.getId());

        partialUpdatedUserRating.rating(UPDATED_RATING).reviewDate(UPDATED_REVIEW_DATE);

        restUserRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserRating.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUserRating))
            )
            .andExpect(status().isOk());

        // Validate the UserRating in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUserRatingUpdatableFieldsEquals(partialUpdatedUserRating, getPersistedUserRating(partialUpdatedUserRating));
    }

    @Test
    @Transactional
    void patchNonExistingUserRating() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userRating.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userRating.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(userRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserRating in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserRating() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userRating.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(userRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserRating in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserRating() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userRating.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserRatingMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(userRating)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserRating in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserRating() throws Exception {
        // Initialize the database
        insertedUserRating = userRatingRepository.saveAndFlush(userRating);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the userRating
        restUserRatingMockMvc
            .perform(delete(ENTITY_API_URL_ID, userRating.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return userRatingRepository.count();
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

    protected UserRating getPersistedUserRating(UserRating userRating) {
        return userRatingRepository.findById(userRating.getId()).orElseThrow();
    }

    protected void assertPersistedUserRatingToMatchAllProperties(UserRating expectedUserRating) {
        assertUserRatingAllPropertiesEquals(expectedUserRating, getPersistedUserRating(expectedUserRating));
    }

    protected void assertPersistedUserRatingToMatchUpdatableProperties(UserRating expectedUserRating) {
        assertUserRatingAllUpdatablePropertiesEquals(expectedUserRating, getPersistedUserRating(expectedUserRating));
    }
}
