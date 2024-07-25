import { Route } from '../services/router';
import About from './components/About/About';
import Authentication from './components/Authentication/Authentication';
import Main from './components/Main/Main';

const routes: Route[] = [
    {
        route: 'authorization',
        callback: () => new Authentication().node,
        isDefaultRoute: true,
    },
    {
        route: 'main',
        callback: () => new Main().node,
    },
    {
        route: 'about',
        callback: () => new About().node,
    },
];

export default routes;
