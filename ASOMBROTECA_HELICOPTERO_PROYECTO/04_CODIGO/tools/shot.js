const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForFunction(()=>window.__ready===true,null,{timeout:60000});
await p.screenshot({path:process.argv[3],fullPage:true});console.log(errs.length?errs:'sin errores');await b.close();})();
