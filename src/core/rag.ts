/** Sparse TF-IDF vectors and cosine. Lexical retrieval, never semantic embeddings. */
export interface Document {
  id: string;
  title: string;
  text: string;
}
export interface Chunk {
  id: string;
  document: string;
  title: string;
  start: number;
  end: number;
  text: string;
}
export function terms(text: string): string[] {
  return (
    text
      .normalize('NFC')
      .toLocaleLowerCase('fr')
      .match(/[\p{L}\p{N}]+/gu) ?? []
  );
}
export function chunkDocuments(documents: Document[], size = 30, overlap = 5): Chunk[] {
  if (
    !Number.isInteger(size) ||
    size < 5 ||
    size > 120 ||
    !Number.isInteger(overlap) ||
    overlap < 0 ||
    overlap >= size
  )
    throw Error('Découpage invalide.');
  if (
    !documents.length ||
    documents.length > 8 ||
    new Set(documents.map((d) => d.id)).size !== documents.length
  )
    throw Error('1 à 8 documents distincts requis.');
  const chunks: Chunk[] = [];
  for (const d of documents) {
    if (!d.id || d.id.length > 60 || d.title.length > 120 || d.text.length > 12000)
      throw Error('Document hors limites.');
    const words = d.text.trim().split(/\s+/u).filter(Boolean);
    if (words.length > 1800) throw Error('Document trop long.');
    for (let start = 0; start < words.length; start += size - overlap) {
      const end = Math.min(start + size, words.length);
      chunks.push({
        id: d.id + ':' + start,
        document: d.id,
        title: d.title,
        start,
        end,
        text: words.slice(start, end).join(' '),
      });
      if (end === words.length) break;
    }
  }
  if (chunks.length > 500) throw Error('Index trop volumineux.');
  return chunks;
}
export function retrieve(chunks: Chunk[], query: string, topK = 3) {
  if (!Number.isInteger(topK) || topK < 1 || topK > 8 || query.length > 500 || chunks.length > 500)
    throw Error('Recherche hors limites.');
  const bags = chunks.map((c) => terms(c.text)),
    df = new Map<string, number>();
  for (const bag of bags) for (const term of new Set(bag)) df.set(term, (df.get(term) ?? 0) + 1);
  const idf = new Map([...df].map(([t, n]) => [t, Math.log((1 + chunks.length) / (1 + n)) + 1]));
  const vector = (tokens: string[]) => {
    const v = new Map<string, number>();
    for (const t of tokens) if (idf.has(t)) v.set(t, (v.get(t) ?? 0) + 1);
    for (const [t, n] of v) v.set(t, n * idf.get(t)!);
    const norm = Math.hypot(...v.values());
    if (norm) for (const [t, n] of v) v.set(t, n / norm);
    return v;
  };
  const q = vector(terms(query));
  const ranked = chunks
    .map((chunk, i) => {
      const v = vector(bags[i]);
      return { chunk, score: [...q].reduce((s, [t, n]) => s + n * (v.get(t) ?? 0), 0) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id))
    .slice(0, topK);
  return {
    ranked,
    vocabularySize: idf.size,
    queryKnownTerms: q.size,
    answer: ranked.length
      ? ranked.map((x) => '[' + x.chunk.id + '] ' + x.chunk.text).join('\n')
      : 'Aucun extrait pertinent : abstention. Aucun modèle génératif n’est appelé.',
  };
}
