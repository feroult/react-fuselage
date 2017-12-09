import expect from 'expect';

import SessionStore from 'src/stores/firebase-session-store';

describe('Session Store', () => {
    it('logs in', () => {
        const session = new SessionStore();
        expect(session.authed).toBeFalsy();

        session.login
    });
});