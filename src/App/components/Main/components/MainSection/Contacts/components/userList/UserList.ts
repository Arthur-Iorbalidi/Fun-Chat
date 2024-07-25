import { container } from 'tsyringe';
import WebSocketService, { Response, WebSocketActions } from '../../../../../../../../services/WebSocketService';
import Element from '../../../../../../../../utils/Element';
import UserData from '../../../../../../../../services/userData';
import CurrentRecipient from '../../../../../../../../services/currentRecipient';

class UserList extends Element<HTMLElement> {
    private webSocketService: WebSocketService = container.resolve(WebSocketService);

    private userData: UserData = container.resolve(UserData);

    private currentRecipient: CurrentRecipient = container.resolve(CurrentRecipient);

    constructor() {
        super({ tag: 'ul', cssClasses: ['userList'] });

        this.webSocketService.subscribe(WebSocketActions.USER_ACTIVE, this.drawUsers.bind(this));
        this.webSocketService.subscribe(WebSocketActions.USER_INACTIVE, this.drawUsers.bind(this));
        this.webSocketService.subscribe(WebSocketActions.USER_EXTERNAL_LOGIN, this.externalLogin.bind(this));
        this.webSocketService.subscribe(WebSocketActions.USER_EXTERNAL_LOGOUT, this.externalLogout.bind(this));
    }

    private drawUsers(response: Response) {
        const { users } = response.payload;
        users?.forEach((user) => {
            if (this.userData.login !== user.login) {
                this.append(this.drawUser(response.type, user.login));
            }
        });
    }

    private drawUser(type: string, login: string) {
        const listItem = new Element({
            tag: 'li',
            cssClasses: ['listItem'],
            attributes: {
                'data-login': login,
                'data-isLogined': type === WebSocketActions.USER_ACTIVE ? 'true' : 'false',
            },
            event: {
                type: 'click',
                callback: this.selectUser.bind(this),
            },
        }).node;

        const marker = new Element({
            tag: 'div',
            cssClasses: ['marker'],
        }).node;

        const userName = new Element({
            tag: 'span',
            cssClasses: ['userName'],
            content: login,
        }).node;

        listItem.append(marker, userName);
        return listItem;
    }

    private externalLogout(response: Response) {
        const users = Array.from(this.node.children);

        users.forEach((user) => {
            const dataLogin = user.getAttribute('data-login');
            if (dataLogin === response.payload.user?.login) {
                user.setAttribute('data-isLogined', 'false');
                user.remove();
                this.node.append(user);
            }
        });
    }

    private externalLogin(response: Response) {
        const users = Array.from(this.node.children);

        let isFound = false;

        users.forEach((user) => {
            const dataLogin = user.getAttribute('data-login');
            if (dataLogin === response.payload.user?.login) {
                user.setAttribute('data-isLogined', 'true');
                user.remove();
                this.node.prepend(user);
                isFound = true;
            }
        });

        if (!isFound) {
            this.prepend(this.drawUser(WebSocketActions.USER_ACTIVE, response.payload.user?.login as string));
        }
    }

    public selectUser(event: Event) {
        const user = event.currentTarget as HTMLElement;

        const userLogin = user.getAttribute('data-login') as string;
        const userStatus = user.getAttribute('data-isLogined') as string;

        this.currentRecipient.setCurrentRecipient(userLogin, userStatus);
    }
}

export default UserList;
