/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-schart';
declare module 'vue-cropperjs';
// ts中引入js需要主动声明
declare module "leaflet";