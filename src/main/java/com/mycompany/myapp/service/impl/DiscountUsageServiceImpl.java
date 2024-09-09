package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.DiscountUsage;
import com.mycompany.myapp.repository.DiscountUsageRepository;
import com.mycompany.myapp.service.DiscountUsageService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.DiscountUsage}.
 */
@Service
@Transactional
public class DiscountUsageServiceImpl implements DiscountUsageService {

    private static final Logger LOG = LoggerFactory.getLogger(DiscountUsageServiceImpl.class);

    private final DiscountUsageRepository discountUsageRepository;

    public DiscountUsageServiceImpl(DiscountUsageRepository discountUsageRepository) {
        this.discountUsageRepository = discountUsageRepository;
    }

    @Override
    public DiscountUsage save(DiscountUsage discountUsage) {
        LOG.debug("Request to save DiscountUsage : {}", discountUsage);
        return discountUsageRepository.save(discountUsage);
    }

    @Override
    public DiscountUsage update(DiscountUsage discountUsage) {
        LOG.debug("Request to update DiscountUsage : {}", discountUsage);
        return discountUsageRepository.save(discountUsage);
    }

    @Override
    public Optional<DiscountUsage> partialUpdate(DiscountUsage discountUsage) {
        LOG.debug("Request to partially update DiscountUsage : {}", discountUsage);

        return discountUsageRepository
            .findById(discountUsage.getId())
            .map(existingDiscountUsage -> {
                if (discountUsage.getUsageDate() != null) {
                    existingDiscountUsage.setUsageDate(discountUsage.getUsageDate());
                }
                if (discountUsage.getTotalDiscountAmount() != null) {
                    existingDiscountUsage.setTotalDiscountAmount(discountUsage.getTotalDiscountAmount());
                }

                return existingDiscountUsage;
            })
            .map(discountUsageRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DiscountUsage> findAll(Pageable pageable) {
        LOG.debug("Request to get all DiscountUsages");
        return discountUsageRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DiscountUsage> findOne(String id) {
        LOG.debug("Request to get DiscountUsage : {}", id);
        return discountUsageRepository.findById(id);
    }

    @Override
    public void delete(String id) {
        LOG.debug("Request to delete DiscountUsage : {}", id);
        discountUsageRepository.deleteById(id);
    }
}
