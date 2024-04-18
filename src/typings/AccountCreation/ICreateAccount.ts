export interface ICreateAccount {
  publicKeyHex: string;
  versionName: string;
  deviceId: string;
  encryptedEmail: string;
  accountStatus: string;
  testnet: boolean;
}
