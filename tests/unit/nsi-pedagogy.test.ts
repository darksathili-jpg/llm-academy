import { describe, expect, it } from 'vitest';
import { activities } from '../../src/content/activities';
import { nsiChallenges } from '../../src/content/nsiChallenges';
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
