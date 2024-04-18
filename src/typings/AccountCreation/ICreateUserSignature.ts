export interface Root {
    payload: Payload
  }
  
  export interface Payload {
    credentialSubject: CredentialSubject
  }
  
  export interface CredentialSubject {
    id: string
  }
  
  