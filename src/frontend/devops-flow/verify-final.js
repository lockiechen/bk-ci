// 最终验证脚本 - 检查所有关键配置
const fs = require('fs');
const http = require('http');

console.log('=== bk-pipeline 最终验证 ===\n');

const results = {
  config: {},
  http: {},
  summary: []
};

// 1. 配置文件验证
console.log('1. 配置文件验证:');
const mainTs = fs.readFileSync('src/main.ts', 'utf-8');
results.config.mainTsHasVue3 = mainTs.includes('window.Vue = Vue') && mainTs.includes('window.Vue.ref');
console.log('  ', results.config.mainTsHasVue3 ? '✓' : '✗', 'main.ts 包含 Vue 3 全局设置');

const html = fs.readFileSync('index.html', 'utf-8');
results.config.htmlHasScript = html.includes('bk-pipeline.min.js') && html.includes('window.Vue');
console.log('  ', results.config.htmlHasScript ? '✓' : '✗', 'index.html 包含加载脚本');

const wrapper = fs.readFileSync('src/utils/bk-pipeline-wrapper.js', 'utf-8');
results.config.wrapperExists = wrapper.includes('window.Vue') && wrapper.includes('window.bkPipeline');
console.log('  ', results.config.wrapperExists ? '✓' : '✗', 'wrapper 文件正确');

const viteConfig = fs.readFileSync('vite.config.ts', 'utf-8');
results.config.viteHasAlias = viteConfig.includes('bkui-pipeline') && viteConfig.includes('bk-pipeline-wrapper');
console.log('  ', results.config.viteHasAlias ? '✓' : '✗', 'vite.config.ts 包含别名');

// 2. HTTP 验证
console.log('\n2. HTTP 服务验证:');
const checkHTTP = (port) => {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode === 200,
          hasMainTs: data.includes('main.ts'),
          hasBkPipeline: data.includes('bk-pipeline.min.js'),
          hasVueCheck: data.includes('window.Vue')
        });
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(2000, () => { req.destroy(); resolve(null); });
  });
};

const checkUMD = (port) => {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/bk-pipeline.min.js`, (res) => {
      resolve(res.statusCode === 200);
      res.on('data', () => {});
      res.on('end', () => {});
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => { req.destroy(); resolve(false); });
  });
};

(async () => {
  for (const port of [5173, 5174, 5175]) {
    const httpCheck = await checkHTTP(port);
    if (httpCheck) {
      results.http.port = port;
      results.http.status = httpCheck.status;
      results.http.hasMainTs = httpCheck.hasMainTs;
      results.http.hasBkPipeline = httpCheck.hasBkPipeline;
      results.http.hasVueCheck = httpCheck.hasVueCheck;
      
      console.log('  ✓ 服务器运行在端口', port);
      console.log('    - 状态码:', httpCheck.status ? '200 ✓' : '✗');
      console.log('    - 包含 main.ts:', httpCheck.hasMainTs ? '✓' : '✗');
      console.log('    - 包含 bk-pipeline 脚本:', httpCheck.hasBkPipeline ? '✓' : '✗');
      console.log('    - 包含 Vue 检查:', httpCheck.hasVueCheck ? '✓' : '✗');
      
      const umdCheck = await checkUMD(port);
      results.http.umdAccessible = umdCheck;
      console.log('    - UMD 文件可访问:', umdCheck ? '✓' : '✗');
      break;
    }
  }
  
  if (!results.http.port) {
    console.log('  ✗ 未找到运行中的服务器');
  }
  
  // 总结
  console.log('\n=== 验证总结 ===');
  const configPassed = Object.values(results.config).every(v => v === true);
  const httpPassed = results.http.port && results.http.status && results.http.umdAccessible;
  
  console.log('配置文件:', configPassed ? '✅ 通过' : '❌ 失败');
  console.log('HTTP 服务:', httpPassed ? '✅ 通过' : '❌ 失败');
  
  const allPassed = configPassed && httpPassed;
  console.log('\n总体结果:', allPassed ? '✅ 所有验证通过！' : '❌ 部分验证失败');
  
  if (allPassed) {
    console.log('\n建议: 在浏览器中打开 http://localhost:' + results.http.port);
    console.log('检查控制台是否显示:');
    console.log('  - [bk-pipeline] Vue 3 global setup: {...}');
    console.log('  - [bk-pipeline] UMD module loaded successfully');
    console.log('  - [bk-pipeline] window.bkPipeline is available');
  }
  
  process.exit(allPassed ? 0 : 1);
})();
