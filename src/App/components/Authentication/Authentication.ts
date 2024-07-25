import { container } from 'tsyringe';
import WebSocketService, { Response, WebSocketActions } from '../../../services/WebSocketService';
import Router from '../../../services/router';
import Element from '../../../utils/Element';
import './Authentication.scss';
import Form from './components/Form/Form';
import Notifications from '../Notifications/Notifications';

class Authentication extends Element<HTMLDivElement> {
    private router = container.resolve(Router);

    private webSocketService: WebSocketService = container.resolve(WebSocketService);

    constructor() {
        super({ tag: 'div', cssClasses: ['authenticationWrapper'] });

        this.webSocketService.subscribe(WebSocketActions.USER_LOGIN, this.toMain.bind(this));
        this.init();
    }

    private init() {
        this.append(new Form().node);
    }

    private toMain(response: Response) {
        if (response.payload.user?.isLogined) {
            this.webSocketService.removeSubscribers();
            this.router.navigateTo('main');
        }

        const notification = new Notifications();
        notification.removeLoadingMessage();
    }
}

export default Authentication;
