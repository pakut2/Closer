export type Environment = Development | Production;

interface Development extends Common {
  isProduction: false;
}

interface Production extends Common {
  isProduction: true;
  version: string;
  sentryDsn: string;
}

interface Common {
  apiUrl: string;
}
