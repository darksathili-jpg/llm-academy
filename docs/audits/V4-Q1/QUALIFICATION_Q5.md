# V4-Q5 — Qualification complémentaire des six expériences

**Référence protégée :** `v4-pilote-retrouve-20261030` · **Branche de travail :** `audit/v4-qualification-q1`.

## Réalisation

Lecture du code JavaScript original du pilote, récupéré par empreinte Git. Ajout de six scénarios Playwright dans `tests/e2e/formation-v4-q5-restants.spec.ts`, couvrant les chapitres 01, 02, 06, 07, 10 et 14.

| Chapitre | Vérification |
|---|---|
| 01 | Affirmation confirmée, contredite et indéterminable ; rétroaction sur erreur |
| 02 | Fusion non chevauchante pour `abab`, `ababa` et `baba` |
| 06 | Recherche `lac` qui retrouve aussi `placard`, requête sans résultat et requête vide |
| 07 | Fuite de l'identifiant A avant déduplication et séparation après |
| 10 | Six étapes du Transformer ; distinction masque causal et distribution de sortie |
| 14 | Sorties JSON et texte ; rejet du champ vide ; limite de vérification de la vérité |

**Ces tests sont publiés, mais non encore exécutés.** Les chapitres 01, 10 et 14 font surtout l'objet de tests de cohérence observable et de limites explicitement affichées ; ils ne démontrent ni raisonnement réel d'un LLM ni transfert pédagogique.

## Exécution

Sur la branche `audit/v4-qualification-q1` :

```powershell
git pull --ff-only
npm run build
npx playwright test tests/e2e/formation-v4-q5-restants.spec.ts --reporter=list
```

Résultat attendu : six scénarios exécutés, sans préjuger du succès. En cas d'échec, conserver la trace et identifier s'il s'agit d'une assertion fragile, d'un écart de contenu ou d'un véritable défaut.

## Limites du jalon

- Le pilote reste une simulation pédagogique, sans LLM entraîné et sans interpréteur Python embarqué.
- L'accès clavier complet, l'impression, les modes de projection, les lecteurs d'écran et le fonctionnement hors ligne restent à éprouver.
- La réussite des tests fonctionnels ne certifie pas la formation autonome : épreuve de transfert inédit et mesure différée indispensables.
- Le tag et le contenu du pilote de référence n'ont pas été modifiés.
