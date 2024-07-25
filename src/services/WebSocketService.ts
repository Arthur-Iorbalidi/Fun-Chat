import { container } from 'tsyringe';
import Notifications from '../App/components/Notifications/Notifications';
import UserData from './userData';
import Router from './router';

export enum WebSocketActions {
    USER_LOGIN = 'USER_LOGIN',
    USER_LOGOUT = 'USER_LOGOUT',
    USER_EXTERNAL_LOGIN = 'USER_EXTERNAL_LOGIN',
    USER_EXTERNAL_LOGOUT = 'USER_EXTERNAL_LOGOUT',
    USER_ACTIVE = 'USER_ACTIVE',
    USER_INACTIVE = 'USER_INACTIVE',
    MSG_SEND = 'MSG_SEND',
    MSG_FROM_USER = 'MSG_FROM_USER',
    MSG_DELIVER = 'MSG_DELIVER',
    MSG_READ = 'MSG_READ',
    MSG_DELETE = 'MSG_DELETE',
    MSG_EDIT = 'MSG_EDIT',
    ERROR = 'ERROR'
}

export interface message {
    id: string,
    from: string,
    to: string,
    text: string,
    datetime: number,
    status: {
        isDelivered: boolean,
        isReaded: boolean,
        isEdited: boolean,
    }
}

export interface Request {
    id: string,
    type: string,
    payload: {
        user?: {
            login: string,
            password?: string,
        },
        message?: {
            to?: string,
            text?: string,
            id?: string
        },
    } | null,
}

export interface Response {
    id: string,
    type: string,
    payload: {
        error?: string,
        user?: {
            login: string,
            isLogined: boolean,
        },
        users?: [
            {
                login: string,
                isLogined: boolean,
            }
        ],
        message?: message,
        messages?: message[],
    },
}

class WebSocketService {
    private url = 'ws://127.0.0.1:4000';

    private webSocket: WebSocket;

    private isWebSocketOpen: boolean = false;

    private router: Router = container.resolve(Router);

    private userData: UserData = container.resolve(UserData);

    public subscribers: Record<string, Array<((response: Response) => void)>> = {};

    private pendingRequests: Request[] = [];

    constructor() {
        this.webSocket = new WebSocket(this.url);
        this.setup();

        const notification = new Notifications();
        notification.createLoadingMessage('Connecting...');
    }

    public subscribe(key: string, callback: (response: Response) => void) {
        if (!this.subscribers[key]) {
            this.subscribers[key] = [];
        }

        this.subscribers[key]?.push(callback);
    }

    public removeSubscribers() {
        const newSubcribers: Record<string, Array<((response: Response) => void)>> = {};
        newSubcribers[WebSocketActions.ERROR] = this.subscribers[WebSocketActions.ERROR];
        this.subscribers = newSubcribers;
    }

    private notify(event: MessageEvent) {
        const response: Response = JSON.parse(event.data);
        this.subscribers[response.type]?.forEach((callback) => {
            callback(response);
        });
    }

    private setup() {
        this.webSocket.addEventListener('open', this.onOpen.bind(this));

        this.webSocket.addEventListener('message', this.notify.bind(this));

        this.webSocket.addEventListener('close', this.onClose.bind(this));
    }

    private onOpen() {
        this.isWebSocketOpen = true;

        this.removeSubscribers();
        this.router.navigateTo('authorization');

        if (this.userData.login !== '') {
            const request = {
                id: '0',
                type: WebSocketActions.USER_LOGIN,
                payload: {
                    user: {
                        login: this.userData.login,
                        password: this.userData.password,
                    },
                },
            };

            this.webSocket.send(JSON.stringify(request));
        }

        while (this.pendingRequests.length > 0) {
            const request: Request = this.pendingRequests.shift() as Request;
            this.send(request);
        }

        const notification = new Notifications();
        notification.removeLoadingMessage();
    }

    private onClose() {
        this.webSocket = new WebSocket(this.url);
        this.setup();

        const notification = new Notifications();
        notification.createLoadingMessage('Connecting...');
    }

    public send(request: Request) {
        if (!this.isWebSocketOpen) {
            this.pendingRequests.push(request);
            return;
        }

        this.webSocket.send(JSON.stringify(request));
    }
}

export default WebSocketService;
