import { useEffect, useRef, useState } from 'react';
import { filteredDistribution, sample, seededRandom } from '../../core/generation';
const words = ['canapé', 'tapis', 'bureau'];
export function StarterPreview() {
  return (
    <aside className="starter-preview" aria-label="Un exemple pour commencer">
      <p className="eyebrow">UNE PHRASE, UNE QUESTION</p>
      <h2>Le chat dort sur le…</h2>
      <p>Quel mot écrirais-tu ensuite ?</p>
      <p className="starter-words">canapé · tapis · bureau</p>
      <p>Une IA qui écrit doit aussi choisir une suite. Commençons par observer ce choix.</p>
      <a href="#/decouvrir">Essayer avec cette phrase →</a>
    </aside>
  );
}
export function FirstSteps() {
  const [step, setStep] = useState(0),
    [guess, setGuess] = useState(''),
    [varied, setVaried] = useState(false),
    [compared, setCompared] = useState(false),
    [answer, setAnswer] = useState(''),
    [checked, setChecked] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  const { probabilities } = filteredDistribution([2, 1, 0], {
    temperature: varied ? 1 : 0.25,
    topK: 0,
    topP: 1,
  });
  const random = seededRandom(7);
  const choices = Array.from({ length: 20 }, () => sample(probabilities, random()));
  const counts = words.map((_, i) => choices.filter((x) => x === i).length);
  const titles = [
    'Quel mot vient ensuite ?',
    'Changer la variété des choix',
    'Une phrase bien écrite peut être fausse',
    'Ce que tu viens de voir',
  ];
  return (
    <article className="first-steps">
      <a href="#/">← Accueil</a>
      <p className="eyebrow">PREMIÈRE DÉCOUVERTE · ENVIRON 5 MINUTES</p>
      <p className="step-counter">Écran {step + 1} sur 4 · Aucun code à connaître</p>
      <h1 ref={heading} tabIndex={-1}>
        {titles[step]}
      </h1>
      {step === 0 ? (
        <>
          <p className="lead">Imagine que tu dois compléter cette phrase.</p>
          <blockquote>Le chat dort sur le…</blockquote>
          <fieldset className="first-choice">
            <legend>Quel mot proposerais-tu ? Il n’y a pas une seule réponse possible.</legend>
            {words.map((word) => (
              <label key={word}>
                <input
                  type="radio"
                  name="first-word"
                  checked={guess === word}
                  onChange={() => setGuess(word)}
                />
                {word}
              </label>
            ))}
          </fieldset>
          <p>
            Une IA qui écrit choisit la suite du texte, puis recommence avec ce qu’elle a déjà
            écrit.
          </p>
          <button disabled={!guess} onClick={() => setStep(1)}>
            Comparer avec la simulation →
          </button>
        </>
      ) : step === 1 ? (
        <>
          <p>
            Tu as proposé « {guess} ». Notre petite simulation donne davantage de chances à « canapé
            ».
          </p>
          <p>
            <strong>À faire :</strong> clique sur « Choix plus variés » et compare les trois
            nombres.
          </p>
          <div className="lab-toolbar">
            <button className="secondary" aria-pressed={!varied} onClick={() => setVaried(false)}>
              Choix presque toujours identiques
            </button>
            <button
              className="secondary"
              aria-pressed={varied}
              onClick={() => {
                setVaried(true);
                setCompared(true);
              }}
            >
              Choix plus variés
            </button>
          </div>
          <section
            className="choice-results"
            aria-label="Résultat de vingt choix"
            aria-live="polite"
          >
            <h2>Sur 20 choix de mots</h2>
            <p>On recommence vingt fois à partir de la même phrase : « Le chat dort sur le… »</p>
            <ul>
              {words.map((word, i) => (
                <li key={word}>
                  <strong>{counts[i]}</strong> fois « {word} »
                </li>
              ))}
            </ul>
            <p>
              {varied
                ? 'Les trois mots peuvent maintenant apparaître. « Canapé » garde davantage de chances que les autres.'
                : 'Le mot favori est presque toujours choisi. Les autres mots ont très peu de chances.'}
            </p>
          </section>
          <p>Ce réglage change la variété des choix. Il ne dit pas où dort réellement un chat.</p>
          <p className="muted">
            Exemple préparé : les préférences de départ sont inventées ; les choix sont calculés. Ce
            n’est pas une IA entraînée.
          </p>
          <button disabled={!compared} onClick={() => setStep(2)}>
            Continuer : est-ce forcément vrai ? →
          </button>
        </>
      ) : step === 2 ? (
        <>
          <p className="lead">Vérifions une réponse en la comparant avec un document.</p>
          <blockquote>
            Document de cet exercice : « La bibliothèque est fermée le lundi. Elle ouvre le mardi. »
          </blockquote>
          <p>
            Une réponse affirme : <strong>« La bibliothèque est ouverte le lundi. »</strong>
          </p>
          <fieldset className="first-choice">
            <legend>Que peut-on conclure à partir du document ?</legend>
            {[
              'Le document confirme cette réponse.',
              'Le document dit le contraire.',
              'Le document ne permet pas de savoir.',
            ].map((text, i) => (
              <label key={text}>
                <input
                  type="radio"
                  name="first-check"
                  checked={answer === String(i)}
                  onChange={() => {
                    setAnswer(String(i));
                    setChecked(false);
                  }}
                />
                {text}
              </label>
            ))}
          </fieldset>
          <button disabled={!answer} onClick={() => setChecked(true)}>
            Vérifier avec le document
          </button>
          {checked && (
            <p className="feedback" role="status">
              {answer === '1'
                ? 'Oui. Le document dit « fermée le lundi ». La réponse est donc fausse d’après ce document.'
                : 'Relis « fermée le lundi » et « ouverte le lundi ». Ces deux phrases disent le contraire. Tu peux changer ton choix.'}
            </p>
          )}
          {checked && answer === '1' && (
            <button onClick={() => setStep(3)}>Retenir l’essentiel →</button>
          )}
        </>
      ) : (
        <>
          <p className="lead">
            Bien écrire une réponse et donner une réponse vraie sont deux choses différentes.
          </p>
          <ol className="takeaways">
            <li>Une IA qui écrit choisit la suite d’un texte, morceau après morceau.</li>
            <li>Ses réglages peuvent rendre ses choix plus ou moins variés.</li>
            <li>
              Pour vérifier une affirmation, il faut la comparer avec des informations fiables.
            </li>
          </ol>
          <details>
            <summary>Les trois mots techniques, maintenant expliqués</summary>
            <dl className="plain-glossary">
              <dt>LLM</dt>
              <dd>
                Le sigle anglais pour « grand modèle de langage » : un type d’IA entraîné sur
                beaucoup de textes pour en produire.
              </dd>
              <dt>Token</dt>
              <dd>
                Un morceau de texte traité par le modèle. Nous avons choisi des mots entiers ici ;
                dans un vrai modèle, un mot peut être découpé en plusieurs morceaux.
              </dd>
              <dt>Température</dt>
              <dd>
                Le nom du réglage qui modifie la variété des choix. Ce n’est pas de la chaleur et
                cela ne vérifie pas la vérité.
              </dd>
            </dl>
          </details>
          <p>
            Tu peux maintenant commencer une activité guidée. Les termes y sont expliqués près de la
            manipulation.
          </p>
          <a className="button" href="#/activite/credibilite">
            Première activité : vérifier trois phrases →
          </a>
          <p>
            <a href="#/studio">Je suis enseignant : préparer une séance →</a>
          </p>
        </>
      )}
      {step > 0 && (
        <div className="first-back">
          <button className="secondary" onClick={() => setStep((s) => s - 1)}>
            Revenir à l’écran précédent
          </button>
        </div>
      )}
    </article>
  );
}
