declare module "vsop87" {
  export interface VsopPlanetData {
    [key: string]: any;
  }

  const vsop: {
    mercury: VsopPlanetData;
    venus: VsopPlanetData;
    earth: VsopPlanetData;
    mars: VsopPlanetData;
    jupiter: VsopPlanetData;
    saturn: VsopPlanetData;
    uranus: VsopPlanetData;
    neptune: VsopPlanetData;
  };

  export default vsop;
}
