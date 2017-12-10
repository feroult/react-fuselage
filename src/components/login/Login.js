import React from "react";
import {connect} from '../../utils/middleware';

const Login = connect('session', ({sessionStore}) => {

    const signIn = () => {
        session.login();
    };

    return (
        <div className="login-form">
            <a onClick={signIn}>
                <img src={googleSignin} alt="Sign in with Google"/>
            </a>
        </div>
    );

});

export default Login;