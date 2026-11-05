/* Calculatrice d'appoint LLM Academy : intégration officielle sur action explicite.
   Ne redistribue pas le code NumWorks. Fonctionne sans tiers par défaut. */
(() => {
  const source='https://www.numworks.com/simulator/embed/';
  function mount(host) {
    if (host.dataset.calculatorMounted==='true') return;
    host.dataset.calculatorMounted='true';
    const wrap=document.createElement('section');
    wrap.className='llm-calculator';
    wrap.style.cssText='border:1px solid #72959f;border-radius:12px;padding:16px;margin:18px 0';
    const heading=document.createElement('h2');heading.textContent='Calculatrice scientifique — aide facultative';
    const text=document.createElement('p');text.textContent='Vérifie une racine carrée, une exponentielle, un produit ou une division. Tu dois toujours justifier ton calcul : la calculatrice ne valide pas une réponse.';
    const local=document.createElement('p');local.textContent='Hors connexion : utilise une calculatrice physique ou le fichier autonome NumWorks téléchargé directement auprès de son éditeur. Nous ne redistribuons pas ce fichier dans LLM Academy.';
    local.style.fontSize='.9rem';
    const link=document.createElement('a');link.href='https://www.numworks.com/fr/assistance/graphique/emulateur/';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Consulter la version hors connexion sur NumWorks';
    const button=document.createElement('button');button.type='button';button.textContent='Afficher la calculatrice NumWorks officielle';button.style.cssText='padding:12px 15px;border-radius:8px;border:0;background:#145f64;color:white;cursor:pointer;margin:6px 6px 6px 0';
    const status=document.createElement('p');status.setAttribute('role','status');status.style.fontSize='.9rem';
    const framebox=document.createElement('div');framebox.hidden=true;framebox.style.cssText='width:100%;max-width:390px;margin:12px auto;overflow:auto';
    let frame=null;
    button.onclick=()=>{
      if(!frame) {
        frame=document.createElement('iframe');
        frame.src=source;frame.title='Simulateur officiel NumWorks — contenu tiers';
        frame.width='368';frame.height='720';frame.loading='lazy';
        frame.referrerPolicy='strict-origin-when-cross-origin';
        frame.style.cssText='display:block;width:100%;max-width:368px;border:1px solid #78919c;border-radius:8px;background:white';
        framebox.append(frame);
        status.textContent='L’émulateur est chargé depuis numworks.com. Une connexion est nécessaire et ce service tiers peut appliquer sa propre politique de confidentialité.';
        button.textContent='Masquer la calculatrice';
        framebox.hidden=false;
      } else if(framebox.hidden){
        framebox.hidden=false;button.textContent='Masquer la calculatrice';
      } else {
        framebox.hidden=true;button.textContent='Afficher la calculatrice NumWorks officielle';
      }
    };
    wrap.append(heading,text,button,framebox,status,local,link);
    host.append(wrap);
  }
  for(const host of document.querySelectorAll('[data-llm-calculator]'))mount(host);
})();