package com.homebite.config;

import com.homebite.model.*;
import com.homebite.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Automatically seeds initial demo records ONLY IF the database is completely empty.
 * Never modifies or deletes existing user data.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CookProfileRepository cookProfileRepository;
    private final DishRepository dishRepository;
    private final AddressRepository addressRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            CookProfileRepository cookProfileRepository,
            DishRepository dishRepository,
            AddressRepository addressRepository,
            ReviewRepository reviewRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.cookProfileRepository = cookProfileRepository;
        this.dishRepository = dishRepository;
        this.addressRepository = addressRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data ({} users found). Skipping initialization to protect existing records.", userRepository.count());
            return;
        }

        log.info("Database is empty. Initializing HomeBite demo data...");

        // 1. Users
        User admin = new User(
                "admin@homebite.com",
                passwordEncoder.encode("Admin@123"),
                "Admin Supervisor",
                "+1 (555) 000-1111",
                Role.ADMIN
        );
        admin.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");

        User cook1 = new User(
                "maria@homebite.com",
                passwordEncoder.encode("Cook@123"),
                "Maria Rossi",
                "+1 (555) 234-5678",
                Role.COOK
        );
        cook1.setAvatarUrl("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80");

        User cook2 = new User(
                "raj@homebite.com",
                passwordEncoder.encode("Cook@123"),
                "Rajesh Sharma",
                "+1 (555) 345-6789",
                Role.COOK
        );
        cook2.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80");

        User customer = new User(
                "emily@homebite.com",
                passwordEncoder.encode("Customer@123"),
                "Emily Watson",
                "+1 (555) 456-7890",
                Role.CUSTOMER
        );
        customer.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80");

        userRepository.saveAll(List.of(admin, cook1, cook2, customer));

        // 2. Cook Profiles
        CookProfile profile1 = new CookProfile();
        profile1.setUser(cook1);
        profile1.setKitchenName("Nonna's Hearth & Pasta");
        profile1.setBio("Cooking authentic Northern Italian recipes handed down through four generations. Fresh handmade pasta daily.");
        profile1.setSpecialty("Italian Artisanal");
        profile1.setKitchenAddress("42 Maple Street, Northside");
        profile1.setIsVerified(true);
        profile1.setRatingAvg(BigDecimal.valueOf(4.92));
        profile1.setRatingCount(48);

        CookProfile profile2 = new CookProfile();
        profile2.setUser(cook2);
        profile2.setKitchenName("Spice Harmony Kitchen");
        profile2.setBio("Homestyle traditional North and South Indian delicacies cooked with freshly stone-ground spices and organic ghee.");
        profile2.setSpecialty("Indian Traditional");
        profile2.setKitchenAddress("18 Oakwood Avenue, Westside");
        profile2.setIsVerified(true);
        profile2.setRatingAvg(BigDecimal.valueOf(4.88));
        profile2.setRatingCount(36);

        cookProfileRepository.saveAll(List.of(profile1, profile2));

        // 3. Dishes
        Dish dish1 = new Dish();
        dish1.setCookProfile(profile1);
        dish1.setName("Slow-Baked Ragu Lasagna");
        dish1.setDescription("Layers of handmade sheet pasta, 6-hour simmered beef & pancetta bolognese, silky bechamel, and melted aged Parmigiano.");
        dish1.setCategory("Italian");
        dish1.setPrice(BigDecimal.valueOf(16.50));
        dish1.setPrepTimeMinutes(45);
        dish1.setIsVegetarian(false);
        dish1.setIsVegan(false);
        dish1.setIsGlutenFree(false);
        dish1.setIsAvailable(true);
        dish1.setImageUrl("/src/assets/images/dish_lasagna_1791702722110.jpg");

        Dish dish2 = new Dish();
        dish2.setCookProfile(profile1);
        dish2.setName("Handmade Spinach Ricotta Ravioli");
        dish2.setDescription("Fresh delicate pasta parcels stuffed with whipped organic ricotta and baby spinach in browned butter sage reduction.");
        dish2.setCategory("Italian");
        dish2.setPrice(BigDecimal.valueOf(14.50));
        dish2.setPrepTimeMinutes(30);
        dish2.setIsVegetarian(true);
        dish2.setIsVegan(false);
        dish2.setIsGlutenFree(false);
        dish2.setIsAvailable(true);
        dish2.setImageUrl("https://images.unsplash.com/photo-1587740908075-9e245070dfaa?auto=format&fit=crop&w=800&q=80");

        Dish dish3 = new Dish();
        dish3.setCookProfile(profile2);
        dish3.setName("Heritage Butter Chicken & Naan");
        dish3.setDescription("Tender charred tandoori chicken simmered in a velvety tomato-fenugreek sauce, served with garlic naan and fragrant basmati.");
        dish3.setCategory("Indian");
        dish3.setPrice(BigDecimal.valueOf(17.00));
        dish3.setPrepTimeMinutes(35);
        dish3.setIsVegetarian(false);
        dish3.setIsVegan(false);
        dish3.setIsGlutenFree(false);
        dish3.setIsAvailable(true);
        dish3.setImageUrl("/src/assets/images/dish_curry_1791702733069.jpg");

        Dish dish4 = new Dish();
        dish4.setCookProfile(profile2);
        dish4.setName("Slow-Simmered Dal Makhani");
        dish4.setDescription("Whole black lentils and kidney beans slow-cooked overnight with ginger, roasted cumin, and cultured butter.");
        dish4.setCategory("Indian");
        dish4.setPrice(BigDecimal.valueOf(13.00));
        dish4.setPrepTimeMinutes(25);
        dish4.setIsVegetarian(true);
        dish4.setIsVegan(false);
        dish4.setIsGlutenFree(true);
        dish4.setIsAvailable(true);
        dish4.setImageUrl("https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80");

        dishRepository.saveAll(List.of(dish1, dish2, dish3, dish4));

        // 4. Address
        Address address = new Address();
        address.setUser(customer);
        address.setStreetAddress("742 Evergreen Terrace");
        address.setCity("Springfield");
        address.setState("IL");
        address.setPostalCode("62704");
        address.setIsDefault(true);
        addressRepository.save(address);

        // 5. Reviews
        Review review1 = new Review(dish1, customer, 5, "Without exaggeration, the best lasagna I have eaten in years. Tasted just like my grandmother used to bake on Sundays!");
        Review review2 = new Review(dish3, customer, 5, "The butter chicken was extraordinarily rich and delicately spiced. The garlic naan arrived warm and soft.");
        reviewRepository.saveAll(List.of(review1, review2));

        log.info("HomeBite PostgreSQL database successfully initialized with demo seed data!");
    }
}
