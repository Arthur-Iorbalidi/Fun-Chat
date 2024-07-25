export type Route = {
    route: string;
    callback: () => HTMLElement;
    isDefaultRoute?: boolean;
  };

export default class Router {
    private routes: Record<Route['route'], Route['callback']> = {};

    private baseUrl: string = '/arthur-iorbalidi-JSFE2023Q4/Fun-Chat/dist/';

    public navigateTo(url: string) {
        window.history.pushState({}, '', `${this.baseUrl}${url}`);
        window.dispatchEvent(new PopStateEvent('popstate', {}));
    }

    public navigateBack() {
        window.history.back();
    }

    public initRouter(routes: Route[], notifier: (page: HTMLElement) => void) {
        this.addRoutes(routes);

        window.addEventListener('popstate', this.changePage.bind(this, notifier));

        this.changePage(notifier);
    }

    private addRoutes(routes: Route[]) {
        routes.forEach((route) => {
            this.addRoute(route);
        });
    }

    public addRoute({ route, callback, isDefaultRoute }: Route) {
        this.routes[`${this.baseUrl}${route}`] = callback;
        if (isDefaultRoute) {
            this.routes[`${this.baseUrl}`] = callback;
        }
    }

    private changePage(notifier: (page: HTMLElement) => void) {
        const path = window.location.pathname;
        if (this.routes[path]) {
            notifier(this.routes[path]());
        }
    }
}
