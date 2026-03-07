package com.esprit.user.entities;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    CITOYEN,
    AGENT,
    ADMIN;

    @Override
    public String getAuthority() {
        return name();
    }
}
