/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly REACT_APP_PAYPAL_CLIENT_ID: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  