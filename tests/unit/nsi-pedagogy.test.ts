import { describe, expect, it } from 'vitest';
import { activities } from '../../src/content/activities';
import { nsiChallenges } from '../../src/content/nsiChallenges';
import { essentials, extensions, orderedActivities } from '../../src/content/learningPath';
import { teacherSequences } from '../../src/content/teacherSequences';
import { scenarios } from '../../src/content/scenarios';
import { emptyInvestigation } from '../../src/core/investigation';
import { reviewInvestigation } from '../../src/core/pedagogicalReview';

describe('missions NSI et bilan pédagogique', () => {
  it('associe une mission Python autonome à chacune des dix activités', () => {
    expect(activities).toHaveLength(10);
    expect(Object.keys(nsiChallenges).sort()).toEqual(activities.map((a) => a.id).sort());
    for (const activity of activities) {
      const mission = nsiChallenges[activity.id];
      expect(mission.goal.trim().length).toBeGreaterThan(20);
      expect(mission.starter).toContain('assert ');
      expect(mission.solution).toContain('assert ');
      expect(mission.starter).toContain('TODO');
      expect(mission.starter).not.toEqual(mission.solution);
      expect(mission.transfer.trim()).not.toBe('');
    }
  });

  it('ne certifie pas la maîtrise sur la seule réponse au QCM', () => {
    const trace = emptyInvestigation();
    trace.answer = '1';
    expect(reviewInvestigation(trace, '1')).toEqual({
      missing: [
        'Hypothèse avant la manipulation',
        'Observation de l’expérience',
        'Explication personnelle',
        'Réponse à une situation nouvelle',
      ],
      conclusionCorrect: true,
      readyForReview: false,
    });
  });

  it('ne donne qu’un statut de relecture, jamais une note automatique', () => {
    const trace = {
      ...emptyInvestigation(),
      hypothesis: 'Je prévois une modification mesurable.',
      observation: 'Je compare deux résultats.',
      explanation: 'Je relie le résultat aux données.',
      transfer: 'Je propose une expérience indépendante.',
      answer: '2',
    };
    expect(reviewInvestigation(trace, '2')).toEqual({
      missing: [],
      conclusionCorrect: true,
      readyForReview: true,
    });
    expect(reviewInvestigation(trace, '0').readyForReview).toBe(false);
  });
});

describe('qualification pédagogique des dix investigations', () => {
  it('ordonne la découverte avant les prolongements hors programme', () => {
    expect(essentials).toHaveLength(7);
    expect(extensions).toHaveLength(3);
    expect(new Set([...essentials, ...extensions]).size).toBe(10);
    expect(orderedActivities().map((a) => a.id)).toEqual([...essentials, ...extensions]);
    expect(activities.map((a) => a.id).sort()).toEqual(
      orderedActivities()
        .map((a) => a.id)
        .sort(),
    );
  });

  it('définit de vrais prérequis par activité, y compris pour Python facultatif', () => {
    const prerequisites = activities.map((a) => a.prerequisites);
    expect(new Set(prerequisites).size).toBe(activities.length);
    for (const activity of activities) {
      expect(activity.prerequisites).toContain('Découverte');
      expect(activity.prerequisites).toContain('Python (facultatif)');
      expect(activity.prerequisites).not.toContain('Python : variables, listes, dictionnaires');
    }
    for (const id of extensions) {
      expect(activities.find((a) => a.id === id)!.prerequisites).toContain('hors programme');
    }
  });

  it('fournit trois séances entièrement minutées et distinctes', () => {
    expect(teacherSequences).toHaveLength(3);
    expect(new Set(teacherSequences.map((x) => x.id)).size).toBe(3);
    for (const sequence of teacherSequences) {
      expect(sequence.duration).toBe(60);
      expect(sequence.steps.reduce((total, step) => total + step.minutes, 0)).toBe(60);
      expect(sequence.objectives.length).toBeGreaterThanOrEqual(3);
      expect(sequence.steps.length).toBeGreaterThanOrEqual(5);
      for (const step of sequence.steps) {
        expect(activities.some((a) => a.id === step.activity)).toBe(true);
        for (const field of ['teacher', 'learner', 'question', 'expected', 'vigilance'] as const)
          expect(step[field].length).toBeGreaterThan(24);
      }
    }
  });

  it('justifie les modalités par l’activité et non par le rang dans le scénario', () => {
    const all = scenarios.flatMap((scenario) => scenario.steps);
    for (const activity of activities) {
      const steps = all.filter((step) => step.id.startsWith(activity.id + '-'));
      const modes = new Set(steps.map((step) => step.mode));
      if (steps.length > 0) expect(modes.size).toBe(1);
    }
  });
});
