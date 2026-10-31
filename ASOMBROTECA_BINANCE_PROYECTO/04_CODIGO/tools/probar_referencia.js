const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file://'+process.argv[2]);await p.waitForFunction(()=>window.__ready===true,null,{timeout:120000});
console.log(JSON.stringify(await p.evaluate(()=>({res:window.res,err:window.err}))),errs);await p.screenshot({path:process.argv[3]});await b.close();})();
