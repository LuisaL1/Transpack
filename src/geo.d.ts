// Tipos mínimos de d3-geo y topojson-client (solo lo que usa src/lib/globe.ts;
// sus paquetes no traen tipos propios).
declare module "d3-geo" {
  type Geo = unknown;
  export interface GeoProjection {
    (point: [number, number]): [number, number] | null;
    scale(k: number): GeoProjection;
    translate(t: [number, number]): GeoProjection;
    rotate(r: [number, number, number?]): GeoProjection;
    clipAngle(a: number): GeoProjection;
    precision(p: number): GeoProjection;
  }
  export interface GeoPath {
    (object: Geo): void;
  }
  export function geoOrthographic(): GeoProjection;
  export function geoPath(projection: GeoProjection, context: CanvasRenderingContext2D): GeoPath;
  export function geoGraticule10(): Geo;
}

declare module "topojson-client" {
  export type GeoFeature = {
    type: "Feature";
    id?: string;
    properties: { z: number };
    geometry: unknown;
  };
  export function feature(topology: unknown, object: unknown): { features: GeoFeature[] };
  export function mesh(
    topology: unknown,
    object: unknown,
    filter?: (a: unknown, b: unknown) => boolean,
  ): unknown;
}
