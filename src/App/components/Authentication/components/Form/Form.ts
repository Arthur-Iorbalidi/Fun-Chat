import { container } from 'tsyringe';
import WebSocketService, { Request, WebSocketActions } from '../../../../../services/WebSocketService';
import Element from '../../../../../utils/Element';
import InputName from './components/InputName';
import InputPassword from './components/InputPassword';
import './Form.scss';
import Router from '../../../../../services/router';
import UserData from '../../../../../services/userData';
import Notifications from '../../../Notifications/Notifications';

class Form extends Element<HTMLDivElement> {
    private router = container.resolve(Router);

    private webSocketService: WebSocketService = container.resolve(WebSocketService);

    private userData: UserData = container.resolve(UserData);

    constructor() {
        super({ tag: 'form', cssClasses: ['form'] });

        this.init();
    }

    private init() {
        this.addEventListener({ type: 'submit', callback: this.register.bind(this) });

        const header: HTMLElement = new Element({ tag: 'h2', cssClasses: ['title'], content: 'Authorization' }).node;

        const submitBtn: HTMLElement = new Element({
            tag: 'button',
            cssClasses: ['submit'],
            content: 'Submit',
            attributes: { disabled: 'true', type: 'submit' },
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

        this.append(header, new InputName().node, new InputPassword().node, submitBtn, aboutBtn);
    }

    private register(event: Event) {
        event.preventDefault();

        const inputName = document.querySelector('.inputName') as HTMLInputElement;
        const inputPassword = document.querySelector('.inputPassword') as HTMLInputElement;

        const request: Request = {
            id: '0',
            type: WebSocketActions.USER_LOGIN,
            payload: {
                user: {
                    login: inputName.value,
                    password: inputPassword.value,
                },
            },
        };

        this.userData.login = inputName.value;
        this.userData.password = inputPassword.value;

        this.webSocketService.send(request);

        const notification = new Notifications();
        notification.createLoadingMessage();
    }

    private toAbout() {
        this.webSocketService.removeSubscribers();
        this.router.navigateTo('about');
    }
}

export default Form;
