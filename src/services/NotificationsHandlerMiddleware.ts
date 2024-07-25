import { container } from 'tsyringe';
import Notifications from '../App/components/Notifications/Notifications';
import WebSocketService, { Response, WebSocketActions } from './WebSocketService';

class NotificationsHandlerMiddleware {
    private webSocketService: WebSocketService = container.resolve(WebSocketService);

    constructor() {
        this.webSocketService.subscribe(WebSocketActions.ERROR, this.showMessage.bind(this));
    }

    public showMessage(response: Response) {
        const notification = new Notifications();

        notification.removeLoadingMessage();

        notification.createErrorMessage(response.payload.error as string);
    }
}

export default NotificationsHandlerMiddleware;
