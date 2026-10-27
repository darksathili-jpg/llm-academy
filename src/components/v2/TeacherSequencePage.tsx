import { teacherSequences } from '../../content/teacherSequences';

export function TeacherSequencePage({
  id,
  audience,
}: {
  id: string;
  audience: 'teacher' | 'student';
}) {
  const sequence = teacherSequences.find((s) => s.id === id);
  if (!sequence) {
    return (
      <article>
        <h1>Séance introuvable</h1>
        <a href="#/enseignant">Revenir au dossier enseignant</a>
      </article>
    );
  }
  const student = audience === 'student';
  return (
    <article className="teacher-sequence-print">
      <div className="eyebrow">
        {student ? 'FICHE PARTICIPANT' : 'FICHE FORMATEUR — CORRIGÉS INCLUS'}
      </div>
      <h1>{sequence.title}</h1>
      <p className="lead">
        {sequence.duration} minutes proposées · {sequence.audience}
      </p>
      <div className="lab-toolbar print-actions">
        <a className="button secondary" href="#/enseignant">
          ← Dossier enseignant
        </a>
        <a className="button secondary" href={'#/' + (student ? 'seance' : 'fiche') + '/' + id}>
          {student ? 'Afficher la fiche formateur' : 'Afficher la fiche participant'}
        </a>
        <button onClick={() => window.print()}>Imprimer cette fiche</button>
      </div>
      <h2>Objectifs</h2>
      <ul>{sequence.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
      {!student && (
        <section>
          <h2>Préparation</h2>
          <p><strong>Prérequis :</strong> {sequence.prerequisites}</p>
          <p><strong>Matériel :</strong> {sequence.equipment}</p>
        </section>
      )}
      <h2>Déroulement</h2>
      <ol className="lesson-steps">
        {sequence.steps.map((step, index) => (
          <li className="lesson-step" key={index}>
            <h3>{step.kind} — {step.minutes} minutes</h3>
            {!student && (
              <p><strong>À dire ou à faire réaliser :</strong> {step.teacher}</p>
            )}
            <p><strong>Travail demandé :</strong> {step.learner}</p>
            <p><strong>Question :</strong> {step.question}</p>
            {student ? (
              <div className="answer-space" aria-label="Espace pour la réponse">
                <p>Ma prédiction, mes observations et ma justification :</p>
              </div>
            ) : (
              <>
                <p><strong>Réponse attendue :</strong> {step.expected}</p>
                <p><strong>Erreur à anticiper :</strong> {step.vigilance}</p>
                <p><a href={'#/activite/' + step.activity}>Manipulation dans l'application →</a></p>
              </>
            )}
          </li>
        ))}
      </ol>
      {!student && (
        <section>
          <h2>Bilan enseignant</h2>
          <p><strong>Preuve finale recherchée :</strong> {sequence.teacherExit}</p>
          <p><strong>Limite scientifique :</strong> {sequence.scientificLimit}</p>
        </section>
      )}
      {student && (
        <section>
          <h2>Ce que je retiens</h2>
          <p>J'explique une expérience réalisée, sa conclusion et une limite.</p>
          <div className="answer-space" aria-label="Espace pour ma synthèse">
            <p>Ma synthèse et mon exemple nouveau :</p>
          </div>
        </section>
      )}
      <p>
        Document pédagogique original. Aucun résultat automatique ne prouve la compréhension.
        Ne pas inscrire de données personnelles sur les fiches partagées.
      </p>
    </article>
  );
}
