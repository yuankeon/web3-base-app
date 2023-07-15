<h1 align="center">Create Web3 App 🚀🚀🚀</h1>

## 介绍

- 可快速搭建一个规范化的 web3 前端项目模板
  1. 包含基本 web3 方法，如钱包连接、普通签名、712 签名、网络切换等
  2. 使用 Eslint + Prettier 代码规范
  3. 使用 husky 管理代码提交
  4. 使用 React + Vite + zustand + antd 等
- 后端、合约开箱即可联调 approve 功能
- 支持 Metamask、Coinbase、WalletConnect 等插件钱包

## 快速开始

1. 安装依赖

```bash
npm install
# or
yarn
```

2. 启动本地开发服务

```bash
npm run dev
# or
yarn dev
```

## 注意事项

项目缺少部分 env 配置文件，如需联调 proxy approve 业务，请联系开发者！！！【仅搭建前端项目可忽略】

## 踩坑记录

主要都是 web3 和钱包等三方库跟 vite、rollup 之间的问题

1. vite + web3js 报错, 解决方法：https://github.com/vitejs/vite/issues/5970

```js
 resolve: {
    alias: {
      web3: resolve(__dirname, './node_modules/web3/dist/web3.min.js'),
    },
  },
```

**update：在更新最新的依赖包后，去掉这行配置，也不会报错了 o.O**

2. vite + coinbase dev 报错【process is not defined】【Buffer is not define】，解决方法：https://github.com/vitejs/vite/discussions/2785

```js
optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      //解决本地 coinbase 报错问题【process is not define】
      //解决本地 coinbase 报错问题 【Buffer is not define】
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
},
```

3. vite + coinbase build 报错【Buffer is not defined】，解决方法：https://github.com/vitejs/vite/discussions/6180

```js
  build: {
    rollupOptions: {
      //解决 vite build 后，coinbase 报错问题 【Buffer is not define】
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
      //手动分块，防止单文件体积过大【超过500kb，vite就会警告】
      //...
    },
  },
```

4. vite + wallet-connectV2 build 报错【m.default.init is not a function 】，解决方法：https://github.com/Uniswap/web3-react/issues/840

```js
resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@walletconnect/ethereum-provider': resolve(
        __dirname,
        './node_modules/@walletconnect/ethereum-provider/dist/index.umd.js'
      ),
    },
},
```
