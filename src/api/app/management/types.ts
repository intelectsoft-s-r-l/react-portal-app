export interface IGenerateDatabase {
  ApplicationID: number;
  Location: EnDbServerLocation;
  Token: string;
}

export enum EnDbServerLocation {
  PUBLIC = 0,
  SAAS = 1,
  PRIVATE = 2,
}
