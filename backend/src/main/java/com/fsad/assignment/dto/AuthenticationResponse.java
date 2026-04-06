package com.fsad.assignment.dto;

import com.fsad.assignment.entity.Role;

public class AuthenticationResponse {
    private String token;
    private Role role;
    private String name;

    public AuthenticationResponse() {
    }

    public AuthenticationResponse(String token, Role role, String name) {
        this.token = token;
        this.role = role;
        this.name = name;
    }

    public static AuthenticationResponseBuilder builder() {
        return new AuthenticationResponseBuilder();
    }

    public String getToken() {
        return this.token;
    }

    public Role getRole() {
        return this.role;
    }

    public String getName() {
        return this.name;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setName(String name) {
        this.name = name;
    }

    public static class AuthenticationResponseBuilder {
        private String token;
        private Role role;
        private String name;

        AuthenticationResponseBuilder() {
        }

        public AuthenticationResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public AuthenticationResponseBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public AuthenticationResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public AuthenticationResponse build() {
            return new AuthenticationResponse(this.token, this.role, this.name);
        }
    }
}
