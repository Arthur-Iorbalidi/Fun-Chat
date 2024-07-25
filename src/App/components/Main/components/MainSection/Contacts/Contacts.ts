import { container } from 'tsyringe';
import WebSocketService, { Request, WebSocketActions } from '../../../../../../services/WebSocketService';
import Element from '../../../../../../utils/Element';
import InputElement from '../../../../../../utils/InputElement';
import './Contacts.scss';
import UserList from './components/userList/UserList';

class Contacts extends Element<HTMLDivElement> {
    private webSocketService: WebSocketService = container.resolve(WebSocketService);

    private usersList = new UserList().node;

    constructor() {
        super({ tag: 'div', cssClasses: ['contacts'] });

        this.init();
        this.getAuthenticatedUsers();
        this.getUnauthorizedUsers();
    }

    private init() {
        const inputSearch = new InputElement({
            cssClasses: ['inputSearch'],
            placeholder: 'Search',
            onInput: this.search.bind(this),
        }).node;

        this.append(inputSearch, this.usersList);
    }

    private search(event: Event) {
        const input = event.target as HTMLInputElement;

        const users = Array.from(this.usersList.children);
        users.forEach((user) => {
            const dataLogin = user.getAttribute('data-login');
            if (!dataLogin?.includes(input.value)) {
                user?.classList.add('hidden');
            } else {
                user?.classList.remove('hidden');
            }
        });
    }

    private getAuthenticatedUsers() {
        const request: Request = {
            id: '0',
            type: WebSocketActions.USER_ACTIVE,
            payload: null,
        };

        this.webSocketService.send(request);
    }

    private getUnauthorizedUsers() {
        const request: Request = {
            id: '0',
            type: WebSocketActions.USER_INACTIVE,
            payload: null,
        };

        this.webSocketService.send(request);
    }
}

export default Contacts;
