import type * as RDF from '@rdfjs/types';
import type { IRdfStoreOptions } from '../IRdfStoreOptions';
import { arePatternsQuoted, encodeOptionalTerms } from '../OrderUtils';
import type { EncodedQuadTerms, QuadPatternTerms, PatternTerm, QuadTerms } from '../PatternTerm';
import type { NestedMapActual } from './RdfStoreIndexNestedMap';
import { RdfStoreIndexNestedMap } from './RdfStoreIndexNestedMap';

/**
 * An RDF store index that is implemented using nested Maps with optimized quoted triple support.
 */
export class RdfStoreIndexNestedMapQuoted<E, V> extends RdfStoreIndexNestedMap<E, V> {
  public readonly features = {
    quotedTripleFiltering: true,
  };

  public constructor(options: IRdfStoreOptions<E>) {
    super(options);
  }

  protected * getQuotedPatternKeys(map: NestedMapActual<E, V>, term: PatternTerm): IterableIterator<E> {
    for (const quotedTripleEncoded of this.dictionary.findQuotedTriplesEncoded(<RDF.Quad>term)) {
      if (map.has(quotedTripleEncoded)) {
        yield quotedTripleEncoded;
      }
    }
  }

  public * find(terms: QuadPatternTerms): IterableIterator<QuadTerms> {
    const ids = encodeOptionalTerms(terms, this.dictionary);
    if (!ids) {
      return;
    }

    const [ id0, id1, id2, id3 ] = ids;
    const [ term0, term1, term2, term3 ] = terms;
    const [ quotedTerm0, quotedTerm1, quotedTerm2, quotedTerm3 ] = arePatternsQuoted(terms);

    let partialQuad0: RDF.Term;
    let partialQuad1: RDF.Term;
    let partialQuad2: RDF.Term;
    let partialQuad3: RDF.Term;

    let map1: NestedMapActual<E, V>;
    let map2: NestedMapActual<E, V>;
    let map3: NestedMapActual<E, V>;

    const map0: NestedMapActual<E, V> = this.nestedMap;
    const map0Keys = <E[] | IterableIterator<E>> (term0 !== undefined ?
      (quotedTerm0 ? this.getQuotedPatternKeys(map0, term0) : (map0.has(id0!) ? [ id0 ] : [])) :
      map0.keys());
    for (const key1 of map0Keys) {
      map1 = <any>map0.get(key1);
      partialQuad0 = !quotedTerm0 && term0 ? term0 : this.dictionary.decode(key1);
      const map1Keys = <E[] | IterableIterator<E>> (term1 !== undefined ?
        (quotedTerm1 ? this.getQuotedPatternKeys(map1, term1) : (map1.has(id1!) ? [ id1 ] : [])) :
        map1.keys());
      for (const key2 of map1Keys) {
        map2 = <any>map1.get(key2);
        partialQuad1 = !quotedTerm1 && term1 ? term1 : this.dictionary.decode(key2);
        const map2Keys = <E[] | IterableIterator<E>> (term2 !== undefined ?
          (quotedTerm2 ? this.getQuotedPatternKeys(map2, term2) : (map2.has(id2!) ? [ id2 ] : [])) :
          map2.keys());
        for (const key3 of map2Keys) {
          map3 = <any>map2.get(key3);
          partialQuad2 = !quotedTerm2 && term2 ? term2 : this.dictionary.decode(key3);
          const map3Keys = <E[] | IterableIterator<E>> (term3 !== undefined ?
            (quotedTerm3 ? this.getQuotedPatternKeys(map3, term3) : (map3.has(id3!) ? [ id3 ] : [])) :
            map3.keys());
          for (const key4 of map3Keys) {
            partialQuad3 = !quotedTerm3 && term3 ? term3 : this.dictionary.decode(key4);
            yield <any>[ partialQuad0, partialQuad1, partialQuad2, partialQuad3 ];
          }
        }
      }
    }
  }

  // The code below is nearly identical. We duplicate because abstraction would result in a significant performance hit.

  public * findEncoded(
    ids: EncodedQuadTerms<E | undefined>,
    terms: QuadPatternTerms,
  ): IterableIterator<EncodedQuadTerms<E>> {
    const [ id0, id1, id2, id3 ] = ids;
    const [ term0, term1, term2, term3 ] = terms;
    const [ quotedTerm0, quotedTerm1, quotedTerm2, quotedTerm3 ] = arePatternsQuoted(terms);

    let map1: NestedMapActual<E, V>;
    let map2: NestedMapActual<E, V>;
    let map3: NestedMapActual<E, V>;

    const map0: NestedMapActual<E, V> = this.nestedMap;
    const map0Keys = <E[] | IterableIterator<E>> (term0 !== undefined ?
      (quotedTerm0 ? this.getQuotedPatternKeys(map0, term0) : (map0.has(id0!) ? [ id0 ] : [])) :
      map0.keys());
    for (const key1 of map0Keys) {
      map1 = <any>map0.get(key1);
      const map1Keys = <E[] | IterableIterator<E>> (term1 !== undefined ?
        (quotedTerm1 ? this.getQuotedPatternKeys(map1, term1) : (map1.has(id1!) ? [ id1 ] : [])) :
        map1.keys());
      for (const key2 of map1Keys) {
        map2 = <any>map1.get(key2);
        const map2Keys = <E[] | IterableIterator<E>> (term2 !== undefined ?
          (quotedTerm2 ? this.getQuotedPatternKeys(map2, term2) : (map2.has(id2!) ? [ id2 ] : [])) :
          map2.keys());
        for (const key3 of map2Keys) {
          map3 = <any>map2.get(key3);
          const map3Keys = <E[] | IterableIterator<E>> (term3 !== undefined ?
            (quotedTerm3 ? this.getQuotedPatternKeys(map3, term3) : (map3.has(id3!) ? [ id3 ] : [])) :
            map3.keys());
          for (const key4 of map3Keys) {
            yield [
              <E>Number.parseInt(<string>key1, 10),
              <E>Number.parseInt(<string>key2, 10),
              <E>Number.parseInt(<string>key3, 10),
              <E>Number.parseInt(<string>key4, 10),
            ];
          }
        }
      }
    }
  }

  public count(terms: QuadPatternTerms): number {
    let count = 0;

    const ids = encodeOptionalTerms(terms, this.dictionary);
    if (!ids) {
      return 0;
    }
    const [ id0, id1, id2, id3 ] = ids;
    const [ term0, term1, term2, term3 ] = terms;
    const [ quotedTerm0, quotedTerm1, quotedTerm2, quotedTerm3 ] = arePatternsQuoted(terms);

    let map1: NestedMapActual<E, V>;
    let map2: NestedMapActual<E, V>;
    let map3: NestedMapActual<E, V>;

    const map0: NestedMapActual<E, V> = this.nestedMap;
    const map0Keys = <E[] | IterableIterator<E>> (term0 !== undefined ?
      (quotedTerm0 ? this.getQuotedPatternKeys(map0, term0) : (map0.has(id0!) ? [ id0 ] : [])) :
      map0.keys());
    for (const key1 of map0Keys) {
      map1 = <any>map0.get(key1);
      const map1Keys = <E[] | IterableIterator<E>> (term1 !== undefined ?
        (quotedTerm1 ? this.getQuotedPatternKeys(map1, term1) : (map1.has(id1!) ? [ id1 ] : [])) :
        map1.keys());
      for (const key2 of map1Keys) {
        map2 = <any>map1.get(key2);
        const map2Keys = <E[] | IterableIterator<E>> (term2 !== undefined ?
          (quotedTerm2 ? this.getQuotedPatternKeys(map2, term2) : (map2.has(id2!) ? [ id2 ] : [])) :
          map2.keys());
        for (const key3 of map2Keys) {
          map3 = <any>map2.get(key3);
          if (term3 !== undefined) {
            if (quotedTerm3) {
              count += [ ...this.getQuotedPatternKeys(map3, term3) ].length;
            } else if (map3.has(id3!)) {
              count++;
            }
          } else {
            count += map3.size;
          }
        }
      }
    }

    return count;
  }
}
