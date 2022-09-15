export enum TileType {
  Grass,
  Snow,
  Water,
  Sand,
}

export enum TileAttributes {
  Base,
  Effect,
  UnBuildable,
  Tree,
  Charchol,
  Iron,
  Gold,
  Crystal,
  Diamond,
}

export type Type = keyof typeof TileType
export type Attr = keyof typeof TileAttributes

export type Attributes = {
  [key in Attr]: number
}

export type Tile = {
  [key in Type]: { count: number; attributes: Attributes }
}
