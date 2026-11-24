// Tipos mínimos de d3-geo y topojson-client (solo lo que usa src/lib/globe.ts;
// sus paquetes no traen tipos propios).
declare module "d3-geo" {
  type Geo = unknown;
  export interface GeoProjection {
    (point: [number, number]): [number, number] | null;
    scale(k: number): GeoProjection;
    scale(): number;
    translate(t: [number, number]): GeoProjection;
    translate(): [number, number];
    rotate(r: [number, number, number?]): GeoProjection;
    rotate(): [number, number, number];
    clipAngle(a: number): GeoProjection;
    precision(p: number): GeoProjection;
    invert(point: [number, number]): [number, number] | null;
  }
  export interface GeoPath {
    (object: Geo): void;
  }
  /** Sin contexto: devuelve el camino como texto SVG (para Path2D) */
  export interface GeoPathString {
    (object: Geo): string | null;
  }
  export interface GeoStream {
    point(x: number, y: number): void;
  }
  /** Proyección propia (o envoltura de otra) que geoPath acepta */
  export interface GeoStreamWrapper {
    stream(output: unknown): unknown;
  }
  export function geoOrthographic(): GeoProjection;
  export function geoPath(
    projection: GeoProjection | GeoStreamWrapper,
    context: CanvasRenderingContext2D,
  ): GeoPath;
  export function geoPath(projection: GeoProjection | GeoStreamWrapper): GeoPathString;
  export function geoTransform(methods: {
    point(this: { stream: GeoStream }, x: number, y: number): void;
  }): GeoStreamWrapper;
  export function geoGraticule10(): Geo;
  export function geoContains(object: Geo, point: [number, number]): boolean;
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
