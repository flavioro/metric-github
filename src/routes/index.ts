import { Router } from 'express';

import UsersController from '../controllers/User/UsersController';
import SessionsController from '../controllers/User/SessionsController';
import ProjectsController from '../controllers/Git/ProjectsController';
import ProjectAnalyticsController from '../controllers/Git/ProjectAnalyticsController';

import userValidator from '../validators/userValidator';
import Authenticate from '../middlewares/Authenticate';
import gitNamesRepositoriesValidator from '../validators/gitNamesRepositoriesValidator';
import githubRepositoryNameValidator from '../validators/githubRepositoryNameValidator';

const routes = Router();

const projectsController = new ProjectsController();
const projectAnalyticsController = new ProjectAnalyticsController();
const usersController = new UsersController();
const sessionsController = new SessionsController();

routes.post('/users', userValidator, usersController.store);
routes.post('/sessions', userValidator, sessionsController.store);

routes.use(Authenticate);

routes.get(
  '/repositories/:gitNamesRepositories',
  gitNamesRepositoriesValidator,
  projectsController.show,
);

routes.get(
  '/metrics/:user/:repository',
  githubRepositoryNameValidator,
  projectAnalyticsController.show,
);

export default routes;
