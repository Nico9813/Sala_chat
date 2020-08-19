import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const useAutentificacion = () => {
    const { user, isAuthenticated } = useAuth0();

    return isAuthenticated ? user.name : ''
};