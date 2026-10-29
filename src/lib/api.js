export const endpoints = Object.freeze({
  login:'v1/accounts/login/', me:'v1/accounts/me/', logout:'v1/accounts/logout/',
  password:'v1/accounts/password/', users:'v1/accounts/users/',
  catalog:'v1/configuration/modules/', apps:'v1/configuration/apps/',
  summary:'v1/reporting/summary/', audit:'v1/reporting/audit/',
});

export class ApiError extends Error {
  constructor(message,status=0,errors={}) {super(message);this.name='ApiError';this.status=status;this.errors=errors;}
}
const baseUrl=(import.meta.env?.VITE_API_BASE_URL||'/api').replace(/\/$/,'');
export function createApiClient(token,onUnauthorized) {
  async function request(path,method='GET',body,options={}) {
    let response;
    try {
      response=await fetch(`${baseUrl}/${path.replace(/^\//,'')}`,{
        method,signal:options.signal,
        headers:{...(token?{Authorization:`Bearer ${token}`} : {}),...(body!==undefined?{'Content-Type':'application/json'}:{})},
        body:body===undefined?undefined:JSON.stringify(body),
      });
    } catch(error) {
      if(error.name==='AbortError') throw error;
      throw new ApiError('Cannot reach the school server. Check that Django is running on port 8000.');
    }
    if(response.status===204) return null;
    if(options.download&&response.ok) return response.blob();
    const payload=response.headers.get('content-type')?.includes('application/json')?await response.json():null;
    if(!response.ok) {
      if(response.status===401&&token) onUnauthorized?.();
      throw new ApiError(typeof payload?.detail==='string'?payload.detail:`Request failed (${response.status}).`,response.status,payload?.errors||{});
    }
    if(payload===null) throw new ApiError('The server returned an unexpected response. Check the API proxy configuration.');
    return payload;
  }
  request.download=(path,options={})=>request(path,'GET',undefined,{...options,download:true});
  return request;
}
export function resourcePath(catalog,module,id) {
  const endpoint=catalog[module]?.endpoint;
  if(!endpoint) throw new ApiError('This module is not available. Refresh the workspace.');
  return endpoint+(id===undefined?'':`${id}/`);
}
