export type IBlueprint =
| { $condition?: string }
| { [path: string]: IBlueprint | null }

export interface ITagDefinitions {
  [path: string]: string[] | ITagDefinitions
}
