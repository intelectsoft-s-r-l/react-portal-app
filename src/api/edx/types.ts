export interface InvoiceLines {
  Article: string;
  BarCode: string;
  Code: string;
  Name: string;
  Price: number;
  PriceNet: number;
  Quantity: number;
  TotalSum: number;
  TotalSumNet: number;
  TotalVAT: number;
  Unit: string;
  VATPercent: number;
}
export interface InvoiceList {
  CreateDate: string;
  Date: string;
  DeliveryDate: string;
  FromCompanyFiscalID: string;
  FromCompany_Name: string;
  InvoiceExternalID: string;
  Lines: InvoiceLines[];
  Number: string;
}

export interface IOrderLines {
  Article: string;
  BarCode: string;
  Code: string;
  Name: string;
  Price: number;
  Quantity: number;
}
export interface IOrderList {
  Date: string;
  DeliveryDate: string;
  FromCompanyFiscalID: string;
  FromCompanyName: string;
  Lines: IOrderLines[];
  Number: string;
  OrderExternalID: string;
}
