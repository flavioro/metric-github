import { Router } from 'express';

import GitHubProjectsController from '../controllers/GitHubProjectsController';
import GitHubProjectAnalyticsController from '../controllers/GitHubProjectAnalyticsController';
import UsersController from '../controllers/UsersController';
import SessionsController from '../controllers/SessionsController';

import projectNameValidator from '../validators/projectNameValidator';
import githubRepositoryNameValidator from '../validators/githubRepositoryNameValidator';
import userValidator from '../validators/userValidator';
import Authenticate from '../middlewares/Authenticate';

const routes = Router();

const gitHubProjectsController = new GitHubProjectsController();
const gitHubProjectAnalyticsController = new GitHubProjectAnalyticsController();
const usersController = new UsersController();
const sessionsController = new SessionsController();

routes.post('/users', userValidator, usersController.store);
routes.post('/sessions', userValidator, sessionsController.store);

routes.use(Authenticate);

routes.get(
  '/repositories/:projectName',
  projectNameValidator,
  gitHubProjectsController.show,
);

routes.get(
  '/metrics/:user/:repository',
  githubRepositoryNameValidator,
  gitHubProjectAnalyticsController.show,
);

export default routes;
