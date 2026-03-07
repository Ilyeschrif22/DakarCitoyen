package com.esprit.demande.controller;

import com.esprit.demande.entities.Demande;
import com.esprit.demande.entities.DemandeStatus;
import com.esprit.demande.service.DemandeService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/demandes")
public class DemandeController {
    private final DemandeService service;

    public DemandeController(DemandeService service) {
        this.service = service;
    }

    @PostMapping
    public Demande create(@RequestBody Demande demande) {
        return service.createDemande(demande);
    }

    @GetMapping("/my/{userId}")
    public List<Demande> getMyDemandes(@PathVariable String userId) {
        return service.getDemandesByUserId(userId);
    }

    @GetMapping
    public List<Demande> getAll() {
        return service.getAllDemandes();
    }

    @PutMapping("/{id}/status")
    public Demande updateStatus(@PathVariable String id, @RequestParam DemandeStatus status,
            @RequestParam String agentId) {
        return service.updateStatus(id, status, agentId);
    }

    @PostMapping("/{id}/comments")
    public Demande addComment(@PathVariable String id, @RequestBody String comment) {
        return service.addComment(id, comment);
    }

    @PostMapping("/{id}/documents")
    public Demande uploadDocument(@PathVariable String id, @RequestBody String documentUrl) {
        return service.uploadDocument(id, documentUrl);
    }
}
