import {
  IRepositoryRequest,
  IRepositoryResponse,
} from '../dtos/IRepositoriesGithubDTO';
import AccessApiGithub from '../config/AccessApiGithub';

const responseRepositoriesGit = ({
  id,
  name,
  full_name,
}: IRepositoryRequest): IRepositoryResponse => ({
  id,
  name,
  full_name,
});

interface IFindRepositoriesGit {
  items: IRepositoryRequest[];
}

export const findRepositoriesByName = async (
  q: string,
): Promise<IRepositoryResponse[]> => {
  const { data } = await AccessApiGithub.get<IFindRepositoriesGit>(
    '/search/repositories',
    {
      params: { q, order: 'desc' },
    },
  );

  return data.items
    .slice(0, 10)
    .map(repository => responseRepositoriesGit(repository));
};

export const getRepositoryGitFullName = async (
  fullName: string,
): Promise<IRepositoryResponse> => {
  const { data: repo } = await AccessApiGithub.get<IRepositoryRequest>(
    `/repos/${fullName}`,
  );
  return repo;
};

export const getRepositoriesGit = async (
  repositories: string[],
): Promise<IRepositoryResponse[]> => {
  const promises: Promise<IRepositoryResponse>[] = [];

  repositories.forEach(repository => {
    promises.push(getRepositoryGitFullName(repository));
  });

  const responses = await Promise.all(promises);
  return responses;
};
