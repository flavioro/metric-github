import { Router } from 'express';

import ProjectsController from '../controllers/ProjectsController';
import ProjectAnalyticsController from '../controllers/ProjectAnalyticsController';
import UsersController from '../controllers/UsersController';
import SessionsController from '../controllers/SessionsController';

import projectNameValidator from '../validators/projectNameValidator';
import githubRepositoryNameValidator from '../validators/githubRepositoryNameValidator';
import userValidator from '../validators/userValidator';
import Authenticate from '../middlewares/Authenticate';

const routes = Router();

const projectsController = new ProjectsController();
const projectAnalyticsController = new ProjectAnalyticsController();
const usersController = new UsersController();
const sessionsController = new SessionsController();

routes.post('/users', userValidator, usersController.store);
routes.post('/sessions', userValidator, sessionsController.store);

routes.use(Authenticate);

routes.get(
  '/repositories/:projectName',
  projectNameValidator,
  projectsController.show,
);

routes.get(
  '/metrics/:user/:repository',
  githubRepositoryNameValidator,
  projectAnalyticsController.show,
);

export default routes;
