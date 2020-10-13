import axios from 'axios';

export default axios.create({
  baseURL: process.env.GITHUB_API,
  headers: {
    Accept: 'application/vnd.github.v3+json',
    Authorization: process.env.GITHUB_TOKEN,
  },
});
