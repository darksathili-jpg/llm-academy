/// <reference lib="webworker" />
export {};
const scope=self as unknown as DedicatedWorkerGlobalScope;
const runtimeURL='https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.mjs';
interface PyDictionary {destroy():void}
interface Runtime {runPythonAsync:(code:string,options:{globals:PyDictionary})=>Promise<unknown>;globals:{get:(name:string)=>()=>PyDictionary};setStdout:(options:{batched:(text:string)=>void})=>void;setStderr:(options:{batched:(text:string)=>void})=>void}
let runtime:Runtime|undefined;
scope.onmessage=async (event:MessageEvent<{code:string}>)=>{
 let output='';
 try{
  if(!runtime){
   scope.postMessage({kind:'status',text:'Téléchargement du moteur Python 0.28.3…'});
   const module=await import(/* @vite-ignore */ runtimeURL) as {loadPyodide:(options:{indexURL:string})=>Promise<Runtime>};
   runtime=await module.loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/'});
  }
  const append=(text:string)=>{output=(output+text+'\n').slice(-32000)};
  runtime.setStdout({batched:append});runtime.setStderr({batched:append});
  const globals=runtime.globals.get('dict')();
  try{ await runtime.runPythonAsync(event.data.code,{globals});scope.postMessage({kind:'done',text:output||'Exécution terminée sans sortie.'});}finally{globals.destroy()}
 }catch(error){scope.postMessage({kind:'error',text:error instanceof Error?error.message:String(error)})}
}
