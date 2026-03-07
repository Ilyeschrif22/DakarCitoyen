package com.esprit.demande.repository;

import com.esprit.demande.entities.Demande;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DemandeRepository extends MongoRepository<Demande, String> {
    List<Demande> findByUserId(String userId);
}
