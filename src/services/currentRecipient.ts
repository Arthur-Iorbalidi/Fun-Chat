export enum CurrentRecipientActions {
    CHANGE_RECIPIENT = 'CHANGE_RECIPIENT',
}

class CurrentRecipient {
    public subscribers: Record<string, Array<((login: string, status: string) => void)>> = {};

    public currentRecipient = {
        login: '',
        status: '',
    };

    public setCurrentRecipient(login: string, status: string) {
        this.currentRecipient.login = login;
        this.currentRecipient.status = status;
        this.notify(CurrentRecipientActions.CHANGE_RECIPIENT);
    }

    public subscribe(key: string, callback: (login: string, status: string) => void) {
        if (!this.subscribers[key]) {
            this.subscribers[key] = [];
        }

        this.subscribers[key]?.push(callback);
    }

    private notify(key: string) {
        this.subscribers[key]?.forEach((callback) => {
            callback(this.currentRecipient.login, this.currentRecipient.status);
        });
    }
}

export default CurrentRecipient;
