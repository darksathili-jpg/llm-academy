import { useState } from 'react';
import { exercises, isCorrect, type Exercise, type ModuleId } from '../core/exercises';
import { useProgress } from './ProgressProvider';
function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const { progress, update } = useProgress();
  const saved = progress.answers[exercise.id];
  const [answer, setAnswer] = useState(saved ?? '');
  const [submitted, setSubmitted] = useState(saved !== undefined);
  const correct = isCorrect(exercise, answer);
  return <form className="exercise" onSubmit={event => { event.preventDefault(); setSubmitted(true); update(p => ({ ...p, answers: { ...p.answers, [exercise.id]: answer } })); }}>
    <span className="eyebrow">{exercise.level}</span>
    <fieldset><legend>{exercise.prompt}</legend>
    {exercise.kind === 'choice' ? exercise.choices!.map(choice => <label className="radio" key={choice}><input type="radio" name={exercise.id} value={choice} checked={answer === choice} onChange={() => { setAnswer(choice); setSubmitted(false); }} />{choice}</label>)
      : <label className="answer">Votre résultat<input required inputMode="decimal" value={answer} maxLength={300} onChange={e => { setAnswer(e.target.value); setSubmitted(false); }} /></label>}
    </fieldset>
    <div className="exercise-actions"><button type="submit" disabled={!answer.trim()}>Vérifier ma réponse</button><details><summary>Un indice</summary><p>{exercise.hint}</p></details></div>
    {submitted && <div className={correct ? 'feedback success' : 'feedback'} role="status"><strong>{correct ? 'Résultat validé.' : 'À reprendre.'}</strong><p>{exercise.correction}</p></div>}
  </form>;
}
export function Exercises({ module }: { module: ModuleId }) { return <div className="exercises">{exercises.filter(e => e.module === module).map(e => <ExerciseCard key={e.id} exercise={e} />)}</div>; }

