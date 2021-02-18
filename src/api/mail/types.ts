export interface IMail {
  APIKey: string;
  Action: string;
  Category: string;
  Mail: {
    Attachmnts: {
      File: number[];
      MediaType: string;
      Name: string;
    }[];
    Body: string;
    Cc: string[];
    IsHtmlBody: boolean;
    NoReply: boolean;
    ReplyTo: string;
    Subject: string;
    To: string[];
  };
  Parameters: string;
  SendEmailOnDate: any;
  Source: string;
  Template: number;
}

export interface ITemplate {
  APIKey: string;
  Body: any;
  ID?: number;
  Name: string;
  State?: number;
  Subject: any;
}
