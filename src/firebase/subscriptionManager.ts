import * as firebase from 'firebase';

// tslint:disable-next-line:no-any
type FirebaseHandler = (a: firebase.database.DataSnapshot | null, b?: string | undefined) => any;

class FirebaseSubscriptionManager {
    static subscriptionsMap: Map<string, FirebaseHandler> = new Map();

    static subscribe(name: string, handler: FirebaseHandler) {
        FirebaseSubscriptionManager.subscriptionsMap.set(name, handler);
    }

    static unsubscribe(name: string) {
        FirebaseSubscriptionManager.subscriptionsMap.delete(name);
    }

    static getHandler(name: string) {
        return FirebaseSubscriptionManager.subscriptionsMap.get(name);
    }
}

export default FirebaseSubscriptionManager;
