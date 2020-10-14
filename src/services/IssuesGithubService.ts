import { format, isAfter, differenceInDays, subMonths } from 'date-fns';
import { AxiosResponse } from 'axios';

import AccessApiGithub from '../config/AccessApiGithub';
import {
  IGitIssuesChartStats,
  IGitOpenedIssuesStats,
  IGitIssuesChartStatsRequest,
  IDataset,
} from '../dtos/IGitIssueDTO';

const responseRepositoryOpenedStats = (
  name: string,
  open_issues_count: number,
  average: number,
  deviation: number,
): IGitOpenedIssuesStats => ({
  name,
  open_issues: open_issues_count,
  average,
  deviation,
});

interface RepoIssueRequest {
  created_at: string;
  closed_at: string | null;
  pull_request: {
    url: string;
  };
}

const responseRepositoryIssuesStats = (
  issuesByDate: IGitIssuesChartStatsRequest,
): IGitIssuesChartStats => {
  const datasets: IDataset[] = [];
  const labels: string[] = [];

  Object.keys(issuesByDate).forEach(repo => {
    if (labels.length === 0) {
      Object.keys(issuesByDate[repo].opened).forEach(date => labels.push(date));
    }

    datasets.push({
      label: `${repo} - Opened Issues`,
      data: Object.values(issuesByDate[repo].opened),
      backgroundColor: 'transparent',
    });

    datasets.push({
      label: `${repo} - Closed Issues`,
      data: Object.values(issuesByDate[repo].closed),
      backgroundColor: 'transparent',
    });
  });

  return {
    labels,
    datasets,
  };
};

const defaultGetIssuesParams = {
  direction: 'asc',
  per_page: 100,
};

const getRepositoryIssuePagePromise = async (
  fullName: string,
  params: { [key: string]: string | number },
) => {
  return AccessApiGithub.get<RepoIssueRequest[]>(`/repos/${fullName}/issues`, {
    params,
  });
};

export const getRepositoryOpenedIssuesStats = async (
  fullName: string,
): Promise<IGitOpenedIssuesStats> => {
  const openedIssuesDaysCount: number[] = [];
  const defaultParams = {
    ...defaultGetIssuesParams,
    state: 'open',
  };

  const { data: issues, headers } = await getRepositoryIssuePagePromise(
    fullName,
    defaultParams,
  );

  issues.forEach(({ created_at, pull_request }) => {
    if (!pull_request) {
      openedIssuesDaysCount.push(
        differenceInDays(new Date(), new Date(created_at)),
      );
    }
  });

  if (headers.link) {
    const end = headers.link.split(',').pop();

    const lastPage = parseInt(
      end
        .match(/page=\d+/i)[0]
        .split('=')
        .pop(),
      10,
    );

    const promises = [];
    for (let page = 2; page <= lastPage; page += 1) {
      promises.push(
        getRepositoryIssuePagePromise(fullName, {
          ...defaultParams,
          page,
        }),
      );
    }

    const responses = await Promise.all(promises);
    responses.forEach(response => {
      response.data.forEach(({ created_at, pull_request }) => {
        if (!pull_request) {
          openedIssuesDaysCount.push(
            differenceInDays(new Date(), new Date(created_at)),
          );
        }
      });
    });
  }

  const openedIssuesCount = openedIssuesDaysCount.length;

  const average = Math.round(
    openedIssuesDaysCount.reduce((sum, days) => sum + days, 0) /
      openedIssuesCount,
  );

  const deviation = Math.round(
    Math.sqrt(
      openedIssuesDaysCount
        .map(days => (days - average) ** 2)
        .reduce((sum, days) => sum + days, 0) / openedIssuesCount,
    ),
  );

  return responseRepositoryOpenedStats(
    fullName,
    openedIssuesCount,
    average,
    deviation,
  );
};

export const getRepositoryIssuesStats = async (
  repositories: string[],
): Promise<IGitIssuesChartStats> => {
  const lookForIssuesSince = subMonths(Date.now(), 3);

  const defaultParams = {
    ...defaultGetIssuesParams,
    state: 'all',
    since: lookForIssuesSince.toISOString(),
    page: 1,
  };

  const firstIssuesPage: Promise<{
    fullName: string;
    response: AxiosResponse<RepoIssueRequest[]>;
  }>[] = [];

  const issuesByDate: IGitIssuesChartStatsRequest = {};
  repositories.forEach(fullName => {
    issuesByDate[fullName] = { opened: {}, closed: {} };

    firstIssuesPage.push(
      new Promise(resolve => {
        getRepositoryIssuePagePromise(fullName, defaultParams).then(
          response => {
            resolve({ fullName, response });
          },
        );
      }),
    );
  });

  const promises: Promise<{
    fullName: string;
    data: RepoIssueRequest[];
  }>[] = [];

  const firstIssuesPageResponses = await Promise.all(firstIssuesPage);
  firstIssuesPageResponses.forEach(({ fullName, response }) => {
    const { data: issues, headers } = response;

    issues.forEach(({ created_at, closed_at, pull_request }) => {
      if (!pull_request) {
        const issueCreatedAt = new Date(created_at);

        if (isAfter(issueCreatedAt, lookForIssuesSince)) {
          const createdAtFormated = format(issueCreatedAt, 'dd/MM/yyyy');

          if (issuesByDate[fullName].opened[createdAtFormated]) {
            issuesByDate[fullName].opened[createdAtFormated] += 1;
          } else {
            issuesByDate[fullName].opened[createdAtFormated] = 1;
          }

          repositories.forEach(full_name => {
            issuesByDate[full_name].closed[createdAtFormated] =
              issuesByDate[full_name].closed[createdAtFormated] || 0;

            issuesByDate[full_name].opened[createdAtFormated] =
              issuesByDate[full_name].opened[createdAtFormated] || 0;
          });
        }

        if (closed_at) {
          const issueClosedAt = new Date(closed_at);

          if (isAfter(issueClosedAt, lookForIssuesSince)) {
            const closedAtformated = format(issueClosedAt, 'dd/MM/yyyy');

            if (issuesByDate[fullName].closed[closedAtformated]) {
              issuesByDate[fullName].closed[closedAtformated] += 1;
            } else {
              issuesByDate[fullName].closed[closedAtformated] = 1;
            }

            repositories.forEach(full_name => {
              issuesByDate[full_name].opened[closedAtformated] =
                issuesByDate[full_name].opened[closedAtformated] || 0;

              issuesByDate[full_name].closed[closedAtformated] =
                issuesByDate[full_name].closed[closedAtformated] || 0;
            });
          }
        }
      }
    });

    if (headers.link) {
      const end = headers.link.split(',').pop();

      const lastPage = parseInt(
        end
          .match(/page=\d+/i)[0]
          .split('=')
          .pop(),
        10,
      );

      for (let page = 2; page <= lastPage; page += 1) {
        promises.push(
          new Promise(resolve => {
            getRepositoryIssuePagePromise(fullName, {
              ...defaultParams,
              page,
            }).then(({ data }) => {
              resolve({ fullName, data });
            });
          }),
        );
      }
    }
  });

  const responses = await Promise.all(promises);
  responses.forEach(response => {
    const { fullName, data } = response;

    data.forEach(({ created_at, closed_at, pull_request }) => {
      if (!pull_request) {
        const issueCreatedAt = new Date(created_at);

        if (isAfter(issueCreatedAt, lookForIssuesSince)) {
          const createdAtFormated = format(issueCreatedAt, 'dd/MM/yyyy');

          if (issuesByDate[fullName].opened[createdAtFormated]) {
            issuesByDate[fullName].opened[createdAtFormated] += 1;
          } else {
            issuesByDate[fullName].opened[createdAtFormated] = 1;
          }

          repositories.forEach(full_name => {
            issuesByDate[full_name].closed[createdAtFormated] =
              issuesByDate[full_name].closed[createdAtFormated] || 0;

            issuesByDate[full_name].opened[createdAtFormated] =
              issuesByDate[full_name].opened[createdAtFormated] || 0;
          });
        }

        if (closed_at) {
          const issueClosedAt = new Date(closed_at);

          if (isAfter(issueClosedAt, lookForIssuesSince)) {
            const closedAtFormated = format(issueClosedAt, 'dd/MM/yyyy');

            if (issuesByDate[fullName].closed[closedAtFormated]) {
              issuesByDate[fullName].closed[closedAtFormated] += 1;
            } else {
              issuesByDate[fullName].closed[closedAtFormated] = 1;
            }

            repositories.forEach(full_name => {
              issuesByDate[full_name].opened[closedAtFormated] =
                issuesByDate[full_name].opened[closedAtFormated] || 0;

              issuesByDate[full_name].closed[closedAtFormated] =
                issuesByDate[full_name].closed[closedAtFormated] || 0;
            });
          }
        }
      }
    });
  });

  return responseRepositoryIssuesStats(issuesByDate);
};
