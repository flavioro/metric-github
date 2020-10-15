import { Request, Response } from 'express';
import { badImplementation } from '@hapi/boom';

import { getRepositoryOpenedIssuesStats } from '../../services/IssuesGithubService';
import { getRepositoryGitFullName } from '../../services/RepositoriesGithubService';
import { createMetricService } from '../../services/MetricsService';
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

      // console.log(repo);
      // correction here
      // await createMetricService(
      //   '1', // correction id
      //   repositoryStats.open_issues,
      //   repositoryStats.average,
      //   repositoryStats.deviation,
      // );

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
