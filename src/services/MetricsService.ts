import { badRequest } from '@hapi/boom';

import MetricsRepository from '../repositories/MetricsRepository';

const metricsRepository = new MetricsRepository();

export const createMetricService = async (
  repository_id: string,
  issues_open: number,
  average: number,
  deviation: number,
): Promise<void> => {
  const user = await metricsRepository.findOneByIdAndSameDate(
    repository_id,
    new Date(),
  );

  if (user) {
    throw badRequest('Repository already save that day.');
  }

  await metricsRepository.create(
    repository_id,
    issues_open,
    average,
    deviation,
  );
};
