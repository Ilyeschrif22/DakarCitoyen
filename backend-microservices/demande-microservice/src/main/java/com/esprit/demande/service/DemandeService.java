package com.esprit.demande.service;

import com.esprit.demande.entities.Demande;
import com.esprit.demande.entities.DemandeStatus;
import com.esprit.demande.repository.DemandeRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DemandeService {
    private final DemandeRepository repository;

    public DemandeService(DemandeRepository repository) {
        this.repository = repository;
    }

    public Demande createDemande(Demande demande) {
        demande.setStatus(DemandeStatus.PENDING);
        demande.setCreatedAt(LocalDateTime.now());
        return repository.save(demande);
    }

    public List<Demande> getDemandesByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public List<Demande> getAllDemandes() {
        return repository.findAll();
    }

    public Demande updateStatus(String id, DemandeStatus status, String agentId) {
        Demande demande = repository.findById(id).orElseThrow();
        demande.setStatus(status);
        demande.setAgentId(agentId);
        demande.setUpdatedAt(LocalDateTime.now());
        return repository.save(demande);
    }

    public Demande addComment(String id, String comment) {
        Demande demande = repository.findById(id).orElseThrow();
        demande.getComments().add(comment);
        demande.setUpdatedAt(LocalDateTime.now());
        return repository.save(demande);
    }

    public Demande uploadDocument(String id, String documentUrl) {
        Demande demande = repository.findById(id).orElseThrow();
        demande.getDocuments().add(documentUrl);
        demande.setUpdatedAt(LocalDateTime.now());
        return repository.save(demande);
    }
}
