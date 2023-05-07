module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
    plugins: [
      '@babel/plugin-transform-runtime',
          [
        '@babel/plugin-transform-modules-commonjs', 
        {
          allowTopLevelThis: true,
          loose: true,
          lazy: true
        }
  ],
//   [
//     'import', // antd按需加载
//     {
//       libraryName: 'antd',
//       libraryDirectory: 'es',
//       style: 'css'
//     }
//   ]
]
}