// Typen für occt-import-js (STEP-Import per WebAssembly)
declare module 'occt-import-js' {
  export interface OcctMesh {
    name: string;
    attributes: { position: { array: number[] } };
    index: { array: number[] };
  }
  export interface OcctResult { success: boolean; meshes: OcctMesh[] }
  export interface OcctModule {
    ReadStepFile(content: Uint8Array, params: Record<string, unknown> | null): OcctResult;
  }
  const init: (opts?: { locateFile?: (path: string) => string }) => Promise<OcctModule>;
  export default init;
}
declare module '*.wasm?url' {
  const url: string;
  export default url;
}
