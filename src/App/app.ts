import { container } from 'tsyringe';
import NotificationsHandlerMiddleware from '../services/NotificationsHandlerMiddleware';
import Router from '../services/router';
import routes from './routes';
import Element from '../utils/Element';

class App {
    private router: Router = container.resolve(Router);

    private entryPoint: HTMLElement;

    constructor() {
        const root = new Element({
            tag: 'div',
            cssClasses: ['root'],
        }).node;

        this.entryPoint = root;
        document.body.append(root);
    }

    public start() {
        new NotificationsHandlerMiddleware();

        this.router.initRouter(routes, (page: HTMLElement) => {
            this.render(page);
        });
    }

    private render(page: HTMLElement) {
        this.entryPoint.innerHTML = '';
        this.entryPoint.append(page);
    }
}

export default App;
