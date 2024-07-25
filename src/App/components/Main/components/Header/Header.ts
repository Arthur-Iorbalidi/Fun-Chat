import { container } from 'tsyringe';
import WebSocketService, { Response, WebSocketActions } from '../../../../../services/WebSocketService';
import Element from '../../../../../utils/Element';
import './Header.scss';
import Router from '../../../../../services/router';
import UserData from '../../../../../services/userData';
import Notifications from '../../../Notifications/Notifications';
import CurrentRecipient from '../../../../../services/currentRecipient';

class Header extends Element<HTMLElement> {
    private router = container.resolve(Router);

    private webSocketService: WebSocketService = container.resolve(WebSocketService);

    private userData: UserData = container.resolve(UserData);

    private currentRecipient: CurrentRecipient = container.resolve(CurrentRecipient);

    constructor() {
        super({ tag: 'header', cssClasses: ['header'] });

        this.webSocketService.subscribe(WebSocketActions.USER_LOGOUT, this.toAuthorization.bind(this));
        this.init();
    }

    private init() {
        const textWrapper = new Element({
            tag: 'div',
            cssClasses: ['textWrapper'],
        }).node;

        const userName = new Element({
            tag: 'span',
            cssClasses: ['userName'],
            content: `User: ${this.userData.login}`,
        }).node;

        const appName = new Element({
            tag: 'span',
            cssClasses: ['appName'],
            content: 'Fun-Chat',
        }).node;

        const btnsWrapper = new Element({
            tag: 'div',
            cssClasses: ['btnsWrapper'],
        }).node;

        const aboutBtn: HTMLElement = new Element({
            tag: 'button',
            cssClasses: ['aboutBtn'],
            content: 'About',
            event: {
                type: 'click',
                callback: this.toAbout.bind(this),
            },
        }).node;

        const logoutBtn = new Element({
            tag: 'button',
            cssClasses: ['logoutBtn'],
            content: 'Logout',
            event: {
                type: 'click',
                callback: this.logout.bind(this),
            },
        }).node;

        textWrapper.append(userName, appName);
        btnsWrapper.append(aboutBtn, logoutBtn);
        this.append(textWrapper, btnsWrapper);
    }

    private logout() {
        const request = {
            id: '0',
            type: WebSocketActions.USER_LOGOUT,
            payload: {
                user: {
                    login: this.userData.login,
                    password: this.userData.password,
                },
            },
        };

        this.webSocketService.send(request);

        const notification = new Notifications();
        notification.createLoadingMessage();
    }

    private toAuthorization(response: Response) {
        if (!response.payload.user?.isLogined) {
            this.webSocketService.removeSubscribers();
            this.router.navigateTo('authorization');
        }

        this.userData.login = '';
        this.userData.password = '';

        this.currentRecipient.currentRecipient.login = '';
        this.currentRecipient.currentRecipient.status = '';

        const notification = new Notifications();
        notification.removeLoadingMessage();
    }

    private toAbout() {
        this.webSocketService.removeSubscribers();
        this.router.navigateTo('about');
    }
}

export default Header;
