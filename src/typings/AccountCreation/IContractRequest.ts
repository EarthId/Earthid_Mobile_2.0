export interface IContractRequest {
  accountId: string;
  privateKey: string;
  publicKey: string;
  functionName: string;
  functionParams: string[];
  isViewOnly: false;
}
