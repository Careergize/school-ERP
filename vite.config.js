import {defineConfig,loadEnv} from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(({mode})=>{
  const env=loadEnv(mode,process.cwd(),'');
  // Keep the temporary client demo independent of ignored .env files.
  const demoMode=env.VITE_DEMO_MODE??(mode==='backend'?'false':'true');
  return {define:{'import.meta.env.VITE_DEMO_MODE':JSON.stringify(demoMode)},plugins:[tailwindcss()],server:{proxy:{'/api':{target:env.VITE_API_TARGET||'http://127.0.0.1:8000',changeOrigin:true}}}};
});
