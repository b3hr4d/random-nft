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

type AllData = Type | Attr

export type StandardType = {
  trait_type?: string
  value: Attr | Type
}

export type Attributes = {
  [key in AllData]: number
}

export type Tile = Attributes
