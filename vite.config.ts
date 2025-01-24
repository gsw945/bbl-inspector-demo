import { resolve } from 'path'
import { loadEnv, type ConfigEnv, type UserConfigExport } from 'vite'

export default (configEnv: ConfigEnv): UserConfigExport => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as ImportMetaEnv
  const { VITE_PUBLIC_PATH } = viteEnv
  return {
    /* Modify the 'base' according to the actual situation when packing */
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '/@/': resolve(__dirname, 'src')
      }
    },
    server: {
        /* Setting 'host: true' allows you to access the project by IP using Network. */
        host: true,
        /* Whether to open the browser automatically */
        open: false,
        /* Cross-domain settings allow */
        cors: true,
        /* Whether to exit directly when the port is occupied */
        strictPort: true,
    },
    build: {
        /* Warning if the size of a single chunk file exceeds 2048KB */
        chunkSizeWarningLimit: 2048,
        /* Disable gzip compression size reporting */
        reportCompressedSize: false,
        /* Packaged static resources directory */
        assetsDir: "assets",
        rollupOptions: {
          output: {
            /*
             * chunking strategy
             * 1. Note that these package names must exist, otherwise the package will report an error
             * 2. If you don't want to customize the chunk splitting policy, you can simply remove this configuration
             */
            manualChunks: {
              "babylonjs-core": ["@babylonjs/core"],
            //   "babylonjs-materials": ["@babylonjs/materials"],
            //   "babylonjs-loaders": ["@babylonjs/loaders"],
            //   "babylonjs-post-processes": ["@babylonjs/post-processes"],
            //   "babylonjs-procedural-textures": ["@babylonjs/procedural-textures"],
            //   "babylonjs-serializers": ["@babylonjs/serializers"],
              "babylonjs-gui": ["@babylonjs/gui"],
              "babylonjs-inspector": ["@babylonjs/inspector"],
              "babylonjs-havok": ["@babylonjs/havok"],
              "lil-gui": ["lil-gui"],
              "simple-notify": ["simple-notify"],
              "screenfull": ["screenfull"],
              "neodrag": ["@neodrag/vanilla"]
            }
          }
        }
      },
      /* mixer */
      esbuild: {
        /* Remove 'console.log' when packaging */
        pure: ["console.log"],
        /* Remove 'debugger' when packaging */
        drop: ["debugger"],
        /* Remove all comments when packaging */
        legalComments: "none"
      },
      optimizeDeps: {
          exclude: ['@babylonjs/havok'],
      },
      assetsInclude: ['**/*.gltf', '**/*.glb'],
  }
}
