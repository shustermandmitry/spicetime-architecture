export interface Template {
  /**
   * The name of the template.
   */
  name: string;

  /**
   * The path to the template directory.
   */
  path: string;
}

export type Command = 'batch-mutate' | 'manage-templates' | 'exit';

declare module "prompts" {
  const prompts: any;
  export default prompts;
}
