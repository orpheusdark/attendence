declare namespace NodeJS {
  interface ProcessEnv {
    readonly [key: string]: string | undefined;
  }
}

declare const process: {
  readonly env: NodeJS.ProcessEnv;
};
