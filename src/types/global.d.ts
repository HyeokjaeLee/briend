import type React from 'react';

declare global {
  declare module '*.svg' {
    const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
  }
}
