export type Pair = readonly [string, string];
export interface Word { text: string; frequency: number; tokens: string[] }
export interface PairCount { pair: Pair; count: number }
export interface Snapshot { words: Word[]; vocabulary: string[]; merges: Pair[]; pairs: PairCount[]; replacements: number }
export interface Encoded { text: string; id: number | null; unknown: boolean; original: string }
export const DEFAULT_CORPUS = 'lac lac lama';
const LIMIT = 2000;
export function splitWords(text: string): string[] { return text.split(/\s+/u).filter(Boolean); }
export function validateText(text: string): void {
  if (text.length > LIMIT) throw new Error('Texte limité à 2 000 caractères.');
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(text)) throw new Error('Caractère de contrôle non pris en charge.');
}
export function countPairs(words: readonly Word[]): PairCount[] {
  const pairs = new Map<string, PairCount>();
  for (const word of words) for (let i = 0; i < word.tokens.length - 1; i++) {
    const pair: Pair = [word.tokens[i]!, word.tokens[i + 1]!];
    const key = JSON.stringify(pair);
    const entry = pairs.get(key);
    if (entry) entry.count += word.frequency;
    else pairs.set(key, { pair, count: word.frequency });
  }
  return [...pairs.values()].sort((a, b) => b.count - a.count || (JSON.stringify(a.pair) < JSON.stringify(b.pair) ? -1 : JSON.stringify(a.pair) > JSON.stringify(b.pair) ? 1 : 0));
}
export function mergeTokens(tokens: readonly string[], pair: Pair): string[] {
  const next: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === pair[0] && tokens[i + 1] === pair[1]) { next.push(pair[0] + pair[1]); i++; }
    else next.push(tokens[i]!);
  }
  return next;
}
export function trainBpe(corpus: string, maxMerges = 12): Snapshot[] {
  validateText(corpus);
  if (!Number.isInteger(maxMerges) || maxMerges < 0 || maxMerges > 50) throw new Error('Nombre de fusions invalide.');
  const frequencies = new Map<string, number>();
  for (const word of splitWords(corpus)) frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
  const words = [...frequencies].map(([text, frequency]) => ({ text, frequency, tokens: Array.from(text) }));
  const vocabulary = [...new Set(words.flatMap(w => w.tokens))].sort();
  const initial: Snapshot = { words, vocabulary, merges: [], pairs: countPairs(words), replacements: 0 };
  const states = [initial];
  for (let n = 0; n < maxMerges; n++) {
    const previous = states.at(-1)!;
    const best = previous.pairs[0];
    if (!best) break;
    let replacements = 0;
    const nextWords = previous.words.map(word => {
      const tokens = mergeTokens(word.tokens, best.pair);
      replacements += (word.tokens.length - tokens.length) * word.frequency;
      return { ...word, tokens };
    });
    const symbol = best.pair[0] + best.pair[1];
    states.push({ words: nextWords, vocabulary: previous.vocabulary.includes(symbol) ? [...previous.vocabulary] : [...previous.vocabulary, symbol],
      merges: [...previous.merges, best.pair], pairs: countPairs(nextWords), replacements });
  }
  return states;
}
export function encodeBpe(text: string, snapshot: Snapshot): Encoded[] {
  validateText(text);
  const ids = new Map(snapshot.vocabulary.map((token, i) => [token, i + 1]));
  return text.split(/(\s+)/u).filter(Boolean).flatMap(part => {
    if (/^\s+$/u.test(part)) return [{ text: part, id: null, unknown: false, original: part }];
    let tokens = Array.from(part);
    for (const pair of snapshot.merges) tokens = mergeTokens(tokens, pair);
    return tokens.map(token => ({ text: ids.has(token) ? token : '[UNK]', id: ids.get(token) ?? 0, unknown: !ids.has(token), original: token }));
  });
}
export function tokenCount(snapshot: Snapshot): number {
  return snapshot.words.reduce((sum, word) => sum + word.tokens.length * word.frequency, 0);
}

