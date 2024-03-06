package team.bham.service;

import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import team.bham.domain.*;
import team.bham.repository.*;

public class BookedActivityService {

    private final Logger log = LoggerFactory.getLogger(BookedActivityService.class);

    private final ActivityCompanyRepository companyRepository;
    private final ActivityContactDetailsRepository contactDetailsRepository;
    private final ActivityImageRepository imageRepository;
    private final ActivitySavedRepository savedRepository;
    private final BookedActivityRepository bookedRepository;
    private final SupplierRepository supplierRepository;

    public BookedActivityService(
        ActivityCompanyRepository companyRepository,
        ActivityContactDetailsRepository contactDetailsRepository,
        ActivityImageRepository imageRepository,
        ActivitySavedRepository savedRepository,
        BookedActivityRepository bookedRepository,
        SupplierRepository supplierRepository
    ) {
        this.companyRepository = companyRepository;
        this.contactDetailsRepository = contactDetailsRepository;
        this.imageRepository = imageRepository;
        this.savedRepository = savedRepository;
        this.bookedRepository = bookedRepository;
        this.supplierRepository = supplierRepository;
    }

    public List<ActivityCompany> getcompaniesFromBookedActivity(BookedActivity bookedActivity) {
        return companyRepository.findAllByBookedActivity(bookedActivity);
    }
}
