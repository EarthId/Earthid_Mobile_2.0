export interface IUserSchemaRequest {
    schemaName: string;
    description: string;
    attributes: any[];
    expiration: any;
    dependantSchemas: any[];
  }
  