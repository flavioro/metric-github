import Model, { Metric } from '../models/Metric';
import RepositoriesRepository from './RepositoriesRepository';

const repositoriesRepository = new RepositoriesRepository();

class MetricsRepository {
  async create(
    fullName: string,
    issues_open: number,
    average: number,
    deviation: number,
  ): Promise<Metric> {
    const repositoryGit = await repositoriesRepository.findOneByFullName(
      fullName,
    );

    let _id;
    if (repositoryGit) {
      _id = repositoryGit._id;
    } else {
      const newRepository = await repositoriesRepository.create(fullName);
      _id = newRepository._id;
    }

    const metric = await Model.create({
      repository_id: _id,
      issues_open,
      average,
      deviation,
    });
    return metric;
  }

  async findOneByIdAndSameDate(
    repository_id: string,
    createdAt: Date,
  ): Promise<Metric | null> {
    const metric: Metric | null = await Model.findOne({
      $and: [{ repository_id }, { createdAt }],
    });

    return metric;
  }
}

export default MetricsRepository;
