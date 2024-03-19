package team.bham.service;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import team.bham.domain.*;
import team.bham.domain.Caterers;
import team.bham.repository.*;

@Service
public class CaterersService {

    private final Logger log = LoggerFactory.getLogger(CaterersService.class); //logger rsecord events,actions and errors during execution

    private final BookedCatererRepository bookedCatererRepository;
    private final CaterersRepository caterersRepository;
    private final CuisineRepository cuisineRepository;
    private final DietaryRequirementsRepository dietaryRequirementsRepository;
    private final SupplierRepository supplierRepository;

    public CaterersService(
        BookedCatererRepository bookedCatererRepository,
        CaterersRepository caterersRepository,
        CuisineRepository cuisineRepository,
        DietaryRequirementsRepository dietaryRequirementsRepository,
        SupplierRepository supplierRepository
    ) {
        this.bookedCatererRepository = bookedCatererRepository;
        this.caterersRepository = caterersRepository;
        this.cuisineRepository = cuisineRepository;
        this.dietaryRequirementsRepository = dietaryRequirementsRepository;
        this.supplierRepository = supplierRepository;
    }

    public List<Caterers> getAllCaterers() {
        return caterersRepository.findAll();
    }
}
