import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const BotonLogin = () => {
    const { loginWithRedirect } = useAuth0();

    return <button className="button" onClick={() => loginWithRedirect()}>Log In</button>;
};

export default BotonLogin;