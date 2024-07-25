import { container } from 'tsyringe';
import CurrentRecipient, { CurrentRecipientActions } from '../../../../../../../../services/currentRecipient';
import Element from '../../../../../../../../utils/Element';
import './Recipient.scss';
import WebSocketService, { Response, WebSocketActions } from '../../../../../../../../services/WebSocketService';

class Recipient extends Element<HTMLDivElement> {
    private currentRecipient: CurrentRecipient = container.resolve(CurrentRecipient);

    private webSocketService: WebSocketService = container.resolve(WebSocketService);

    constructor() {
        super({ tag: 'section', cssClasses: ['dialog_header'] });

        this.init();
        this.currentRecipient.subscribe(CurrentRecipientActions.CHANGE_RECIPIENT, this.changeRecipient.bind(this));
        this.webSocketService.subscribe(WebSocketActions.USER_EXTERNAL_LOGIN, this.recipientLogin.bind(this));
        this.webSocketService.subscribe(WebSocketActions.USER_EXTERNAL_LOGOUT, this.recipientLogout.bind(this));
    }

    private init() {
        const userName = new Element({
            tag: 'span',
            cssClasses: ['userName'],
        }).node;

        const userStatus = new Element({
            tag: 'div',
            cssClasses: ['userStatus'],
        }).node;

        this.append(userName, userStatus);
    }

    private changeRecipient(login: string, status: string) {
        const userName = this.node.querySelector('.userName') as HTMLElement;
        userName.textContent = login;

        const userStatus = this.node.querySelector('.userStatus') as HTMLElement;
        if (status === 'true') {
            userStatus.textContent = 'online';
            userStatus.classList.add('active');
        } else {
            userStatus.textContent = 'offline';
            userStatus.classList.remove('active');
        }
    }

    private recipientLogin(response: Response) {
        if (response.payload.user?.login === this.currentRecipient.currentRecipient.login) {
            const userStatus = this.node.querySelector('.userStatus') as HTMLElement;
            userStatus.textContent = 'online';
            userStatus.classList.add('active');
        }
    }

    private recipientLogout(response: Response) {
        if (response.payload.user?.login === this.currentRecipient.currentRecipient.login) {
            const userStatus = this.node.querySelector('.userStatus') as HTMLElement;
            userStatus.textContent = 'offline';
            userStatus.classList.remove('active');
        }
    }
}

export default Recipient;
