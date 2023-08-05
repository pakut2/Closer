export type Environment = Development | Production;

interface Development {
  isProduction: false;
}

interface Production {
  isProduction: true;
  version: string;
  sentryDsn: string;
}
