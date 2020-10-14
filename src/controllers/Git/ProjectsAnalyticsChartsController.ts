import { Request, Response } from 'express';
import { badImplementation } from '@hapi/boom';

import { getRepositoryIssuesStats } from '../../services/IssuesGithubService';
import { getRepositoriesGit } from '../../services/RepositoriesGithubService';

interface CustomRequest {
  query: {
    repositories: string[];
  };
}

class ProjectsAnalyticsChartsController {
  async show(
    request: Request & CustomRequest,
    response: Response,
  ): Promise<Response> {
    const { repositories } = request.query;

    try {
      const repos = await getRepositoriesGit(repositories);
      const repositoryStats = await getRepositoryIssuesStats(
        repos.map(({ full_name }) => full_name),
      );

      return response.json(repositoryStats);
    } catch (err) {
      throw badImplementation(
        'An error occured while getting issues statistics',
      );
    }
  }
}

export default ProjectsAnalyticsChartsController;
