import React from "react";
import { connect } from '../../utils/middleware';

import googleSigninImage from "../../assets/images/google-signin-dark.png";

const Login = connect('session', ({ session }) => {

    const signIn = () => {
        session.login();
    };

    return (
        <div className="login-form">
            <a onClick={signIn}>
                <img src={googleSigninImage} alt="Sign in with Google" />
            </a>
        </div>
    );

});

export { Login };