package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.DiscountLink;
import com.mycompany.myapp.repository.DiscountLinkRepository;
import com.mycompany.myapp.service.DiscountLinkService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.DiscountLink}.
 */
@Service
@Transactional
public class DiscountLinkServiceImpl implements DiscountLinkService {

    private static final Logger LOG = LoggerFactory.getLogger(DiscountLinkServiceImpl.class);

    private final DiscountLinkRepository discountLinkRepository;

    public DiscountLinkServiceImpl(DiscountLinkRepository discountLinkRepository) {
        this.discountLinkRepository = discountLinkRepository;
    }

    @Override
    public DiscountLink save(DiscountLink discountLink) {
        LOG.debug("Request to save DiscountLink : {}", discountLink);
        return discountLinkRepository.save(discountLink);
    }

    @Override
    public DiscountLink update(DiscountLink discountLink) {
        LOG.debug("Request to update DiscountLink : {}", discountLink);
        return discountLinkRepository.save(discountLink);
    }

    @Override
    public Optional<DiscountLink> partialUpdate(DiscountLink discountLink) {
        LOG.debug("Request to partially update DiscountLink : {}", discountLink);

        return discountLinkRepository
            .findById(discountLink.getId())
            .map(existingDiscountLink -> {
                if (discountLink.getDiscountAmount() != null) {
                    existingDiscountLink.setDiscountAmount(discountLink.getDiscountAmount());
                }
                if (discountLink.getAccountedPrice() != null) {
                    existingDiscountLink.setAccountedPrice(discountLink.getAccountedPrice());
                }
                if (discountLink.getDate() != null) {
                    existingDiscountLink.setDate(discountLink.getDate());
                }

                return existingDiscountLink;
            })
            .map(discountLinkRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DiscountLink> findAll(Pageable pageable) {
        LOG.debug("Request to get all DiscountLinks");
        return discountLinkRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DiscountLink> findOne(String id) {
        LOG.debug("Request to get DiscountLink : {}", id);
        return discountLinkRepository.findById(id);
    }

    @Override
    public void delete(String id) {
        LOG.debug("Request to delete DiscountLink : {}", id);
        discountLinkRepository.deleteById(id);
    }
}
