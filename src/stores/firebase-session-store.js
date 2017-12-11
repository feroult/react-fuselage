import firebase from 'firebase';

const firebaseAuth = firebase.auth;

class SessionStore {

    authed = false;

    login = () => {
        const provider = new firebaseAuth.GoogleAuthProvider();
        provider.addScope('email');
        firebaseAuth().signInWithRedirect(provider);
    };
}

export default SessionStore;