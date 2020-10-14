import { Request, Response } from 'express';
import { badImplementation } from '@hapi/boom';

import { getRepositoryOpenedIssuesStats } from '../../services/MetricsService';
import { getRepositoryGitFullName } from '../../services/RepositoriesGithubService';
import StatisticsRepository from '../../repositories/StatisticsRepository';

const statisticsRepository = new StatisticsRepository();

class ProjectAnalyticsController {
  async show(request: Request, response: Response): Promise<Response> {
    const { user, repository } = request.params;
    const { id, session } = request.user;

    try {
      const repo = await getRepositoryGitFullName(`${user}/${repository}`);
      const repositoryStats = await getRepositoryOpenedIssuesStats(
        repo.full_name,
      );

      await statisticsRepository.trackSearch(repo.full_name, id, session);

      return response.json(repositoryStats);
    } catch (err) {
      throw badImplementation(
        "An error occured while trying to calculate repositories's issues statistics",
      );
    }
  }
}

export default ProjectAnalyticsController;
