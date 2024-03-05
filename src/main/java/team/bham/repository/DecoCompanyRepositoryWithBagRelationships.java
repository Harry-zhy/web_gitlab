package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.DecoCompany;

public interface DecoCompanyRepositoryWithBagRelationships {
    Optional<DecoCompany> fetchBagRelationships(Optional<DecoCompany> decoCompany);

    List<DecoCompany> fetchBagRelationships(List<DecoCompany> decoCompanies);

    Page<DecoCompany> fetchBagRelationships(Page<DecoCompany> decoCompanies);
}
