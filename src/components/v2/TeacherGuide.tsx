import { activities } from '../../content/activities';
import { learnerGuides } from '../../content/learnerGuides';
import { nsiChallenges } from '../../content/nsiChallenges';
import { teacherGuides } from '../../content/teacherGuides';

export function TeacherGuide() {
  return (
    <article className="teacher-guide">
      <header className="page-heading">
        <span className="eyebrow">DOSSIER FORMATEUR / DÉBUTER EN LLM</span>
        <h1>Enseigner sans présupposer la maîtrise des LLM.</h1>
        <p className="lead">
          Dix préparations NSI, chacune avec un problème, une erreur probable, une
          intervention pédagogique et une preuve observable de compréhension.
        </p>
      </header>
      <section className="notice">
        <h2>Commencer par ce que l’on peut démontrer</h2>
        <p>
          Les simulations de mots ne sont pas des LLM entraînés. Les poids du
          Transformer miniature sont inventés ; le réseau bigramme apprend réellement
          sur un corpus limité. Une réussite au quiz ne certifie jamais une compétence.
        </p>
        <p>
          Matériel : un navigateur moderne ; Python local facultatif en repli.
          Ne demandez ni compte élève, ni données personnelles, ni clé API.
          Vérifiez la disponibilité hors ligne avant la séance.
        </p>
        <p>
          Proposition pour débuter : 5 minutes de découverte, 15 minutes
          d’investigation, 15 minutes de mise en commun, 15 minutes de défi Python
          NSI et 10 minutes de transfert. Ces durées ne sont pas validées en classe.
        </p>
        <a href="#/decouvrir">Découverte initiale sans code →</a>
      </section>
      <section aria-label="Dossiers pédagogiques par activité">
        <h2>Dix dossiers pour guider et vérifier les apprentissages</h2>
        {activities.map((activity, index) => {
          const guide = learnerGuides[activity.id];
          const teacher = teacherGuides[activity.id];
          const challenge = nsiChallenges[activity.id];
          return (
            <details key={activity.id} className="lesson-section">
              <summary>
                {String(index + 1).padStart(2, '0')} — {guide.title}
              </summary>
              <h3>Avant l’activité</h3>
              <p><strong>Problème :</strong> {guide.question}</p>
              <p><strong>Objectif :</strong> {guide.goal}</p>
              <p><strong>Prérequis :</strong> {activity.prerequisites}</p>
              <p><strong>Déclencheur :</strong> {teacher.starter}</p>
              <h3>Conduite et vigilance</h3>
              <p><strong>Conception erronée probable :</strong> {teacher.misconception}</p>
              <p><strong>Intervention :</strong> {teacher.response}</p>
              <p><strong>Question à poser :</strong> {guide.guess}</p>
              <p><strong>Observation attendue :</strong> {guide.observe}</p>
              <details>
                <summary>Explication scientifique et ses limites</summary>
                <p>{activity.science}</p>
                <p>{activity.errors}</p>
              </details>
              <h3>Évaluation et transfert</h3>
              <p><strong>Ce que l’enseignant doit observer :</strong> {teacher.evidence}</p>
              <p><strong>Question nouvelle :</strong> {teacher.probe}</p>
              <p><strong>Correction et critères :</strong> {activity.correction}</p>
              <ul>{activity.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
              <h3>Prolongement Python de Terminale NSI</h3>
              <p>{challenge.goal}</p>
              <p>{challenge.instruction}</p>
              <p>Le programme contient des assertions exécutables. Elles vérifient les
                résultats des cas prévus, mais pas l’ensemble des apprentissages.
              </p>
              <details>
                <summary>Code de référence et assertions</summary>
                <pre className="code-output">{challenge.solution}</pre>
              </details>
              <p><strong>Variante de transfert :</strong> {challenge.transfer}</p>
              <a href={'#/activite/' + activity.id}>
                Ouvrir l’activité élève →
              </a>
            </details>
          );
        })}
      </section>
      <section className="notice">
        <h2>Protocole d’observation humaine avant validation</h2>
        <ol>
          <li>Un élève entre dans l’activité sans explication orale préalable.</li>
          <li>Il formule une hypothèse avant d’utiliser le laboratoire.</li>
          <li>Il décrit les valeurs observées et la variable qu’il a modifiée.</li>
          <li>Il explique avec ses mots le mécanisme et ce qu’il ne démontre pas.</li>
          <li>Il résout une situation nouvelle et, en NSI, justifie ses assertions Python.</li>
        </ol>
        <p>
          Noter séparément les obstacles de vocabulaire, les erreurs de raisonnement,
          les demandes d’aide, les interventions du professeur et la qualité du transfert.
          Ces observations ne sont pas encore issues d’un essai réel en classe.
        </p>
      </section>
      <a className="button secondary" href="#/studio">
        Préparer une séance dans le studio formateur →
      </a>
    </article>
  );
}
