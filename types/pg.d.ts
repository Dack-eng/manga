declare module "pg" {
  export interface QueryResult<T = unknown> {
    rows: T[];
  }

  export interface PoolClient {
    query<T = unknown>(
      text: string,
      values?: unknown[]
    ): Promise<QueryResult<T>>;
    release(): void;
  }

  export interface PoolConfig {
    connectionString?: string;
    ssl?: { rejectUnauthorized: boolean } | boolean;
  }

  export class Pool {
    constructor(config?: PoolConfig);
    connect(): Promise<PoolClient>;
    end(): Promise<void>;
    query<T = unknown>(
      text: string,
      values?: unknown[]
    ): Promise<QueryResult<T>>;
  }
}
