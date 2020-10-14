import { Request, Response } from 'express';

import { badImplementation } from '@hapi/boom';
import { findRepositoriesByName } from '../../services/RepositoriesGithubService';

class GitHubProjectsController {
  async show(request: Request, response: Response): Promise<Response> {
    const { gitNamesRepositories } = request.params;

    try {
      const repositories = await findRepositoriesByName(gitNamesRepositories);
      return response.json(repositories);
    } catch (err) {
      throw badImplementation(
        'An error occured while trying to get repositories list',
      );
    }
  }
}

export default GitHubProjectsController;
