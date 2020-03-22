import firebase from 'firebase';

const firebaseAuth = firebase.auth;

class SessionStore {

    authed = false;

    static initializeApp(config) {
        firebase.initializeApp(config);
    }

    login = () => {
        const provider = new firebaseAuth.GoogleAuthProvider();
        provider.addScope('email');
        firebaseAuth().signInWithRedirect(provider);
    };
}

export { SessionStore };