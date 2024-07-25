import 'reflect-metadata';
import './style.scss';
import './fonts.scss';
import { container } from 'tsyringe';
import App from './App/app';
import WebSocketService from './services/WebSocketService';
import Router from './services/router';
import UserData from './services/userData';
import CurrentRecipient from './services/currentRecipient';

container.registerSingleton(WebSocketService);
container.registerSingleton(Router);
container.registerSingleton(UserData);
container.registerSingleton(CurrentRecipient);

const app = new App();
app.start();
