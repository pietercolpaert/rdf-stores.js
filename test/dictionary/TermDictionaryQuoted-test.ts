import { DataFactory } from 'rdf-data-factory';
import type { ITermDictionary } from '../../lib/dictionary/ITermDictionary';
import { TermDictionaryNumberRecordFullTerms } from '../../lib/dictionary/TermDictionaryNumberRecordFullTerms';
import { TermDictionaryQuoted } from '../../lib/dictionary/TermDictionaryQuoted';
import 'jest-rdf';

const DF = new DataFactory();

describe('TermDictionaryQuoted', () => {
  let dict: ITermDictionary<number>;

  beforeEach(() => {
    dict = new TermDictionaryQuoted(new TermDictionaryNumberRecordFullTerms());
  });

  describe('encode', () => {
    it('should encode named nodes', () => {
      expect(dict.encode(DF.namedNode('ex:s1'))).toEqual(0);
      expect(dict.encode(DF.namedNode('ex:s2'))).toEqual(1);
      expect(dict.encode(DF.namedNode('ex:s3'))).toEqual(2);

      expect(dict.encode(DF.namedNode('ex:s1'))).toEqual(0);
      expect(dict.encode(DF.namedNode('ex:s2'))).toEqual(1);
      expect(dict.encode(DF.namedNode('ex:s3'))).toEqual(2);
    });

    it('should encode blank nodes', () => {
      expect(dict.encode(DF.blankNode('bs1'))).toEqual(0);
      expect(dict.encode(DF.blankNode('bs2'))).toEqual(1);
      expect(dict.encode(DF.blankNode('bs3'))).toEqual(2);

      expect(dict.encode(DF.blankNode('bs1'))).toEqual(0);
      expect(dict.encode(DF.blankNode('bs2'))).toEqual(1);
      expect(dict.encode(DF.blankNode('bs3'))).toEqual(2);
    });

    it('should encode literals', () => {
      expect(dict.encode(DF.literal('abc'))).toEqual(0);
      expect(dict.encode(DF.literal('def'))).toEqual(1);
      expect(dict.encode(DF.literal('abc', DF.namedNode('ex:d')))).toEqual(2);

      expect(dict.encode(DF.literal('abc'))).toEqual(0);
      expect(dict.encode(DF.literal('def'))).toEqual(1);
      expect(dict.encode(DF.literal('abc', DF.namedNode('ex:d')))).toEqual(2);
    });

    it('should encode variables', () => {
      expect(dict.encode(DF.variable('v1'))).toEqual(0);
      expect(dict.encode(DF.variable('v2'))).toEqual(1);
      expect(dict.encode(DF.variable('v3'))).toEqual(2);

      expect(dict.encode(DF.variable('v1'))).toEqual(0);
      expect(dict.encode(DF.variable('v2'))).toEqual(1);
      expect(dict.encode(DF.variable('v3'))).toEqual(2);
    });

    it('should encode the default graph', () => {
      expect(dict.encode(DF.defaultGraph())).toEqual(0);
      expect(dict.encode(DF.defaultGraph())).toEqual(0);
    });

    it('should encode quoted quads', () => {
      expect(dict.encode(DF.quad(
        DF.namedNode('s'),
        DF.namedNode('p'),
        DF.namedNode('o'),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 1);
      expect(dict.encode(DF.quad(
        DF.namedNode('s3'),
        DF.namedNode('p3'),
        DF.namedNode('o3'),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 2);
      expect(dict.encode(DF.quad(
        DF.namedNode('s2'),
        DF.namedNode('p2'),
        DF.namedNode('o2'),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 3);

      expect(dict.encode(DF.quad(
        DF.namedNode('s'),
        DF.namedNode('p'),
        DF.namedNode('o'),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 1);
      expect(dict.encode(DF.quad(
        DF.namedNode('s3'),
        DF.namedNode('p3'),
        DF.namedNode('o3'),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 2);
      expect(dict.encode(DF.quad(
        DF.namedNode('s2'),
        DF.namedNode('p2'),
        DF.namedNode('o2'),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 3);

      expect(dict.encodeOptional(DF.namedNode('s'))).toEqual(0);
      expect(dict.encodeOptional(DF.namedNode('p'))).toEqual(1);
      expect(dict.encodeOptional(DF.namedNode('o'))).toEqual(2);
      expect(dict.encodeOptional(DF.defaultGraph())).toEqual(3);
      expect(dict.encodeOptional(DF.namedNode('s3'))).toEqual(4);
      expect(dict.encodeOptional(DF.namedNode('p3'))).toEqual(5);
      expect(dict.encodeOptional(DF.namedNode('o3'))).toEqual(6);
      expect(dict.encodeOptional(DF.namedNode('s2'))).toEqual(7);
      expect(dict.encodeOptional(DF.namedNode('p2'))).toEqual(8);
      expect(dict.encodeOptional(DF.namedNode('o2'))).toEqual(9);
    });

    it('should encode nested quoted quads', () => {
      expect(dict.encode(DF.quad(
        DF.namedNode('ex:alice'),
        DF.namedNode('ex:says'),
        DF.quad(
          DF.namedNode('ex:bob'),
          DF.namedNode('ex:says'),
          DF.quad(
            DF.namedNode('ex:carol'),
            DF.namedNode('ex:says'),
            DF.literal('Hello'),
          ),
        ),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 3);

      expect(dict.encode(DF.quad(
        DF.namedNode('ex:alice'),
        DF.namedNode('ex:says'),
        DF.quad(
          DF.namedNode('ex:bob'),
          DF.namedNode('ex:says'),
          DF.quad(
            DF.namedNode('ex:carol'),
            DF.namedNode('ex:says'),
            DF.literal('Hello'),
          ),
        ),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 3);

      // Validate encoding of internal terms
      expect(dict.encodeOptional(DF.namedNode('ex:alice'))).toEqual(0);
      expect(dict.encodeOptional(DF.namedNode('ex:says'))).toEqual(1);
      expect(dict.encodeOptional(DF.namedNode('ex:bob'))).toEqual(2);
      expect(dict.encodeOptional(DF.namedNode('ex:carol'))).toEqual(3);
      expect(dict.encodeOptional(DF.literal('Hello'))).toEqual(4);
      expect(dict.encodeOptional(DF.defaultGraph())).toEqual(5);
      expect(dict.encodeOptional(DF.quad(
        DF.namedNode('ex:carol'),
        DF.namedNode('ex:says'),
        DF.literal('Hello'),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 1);
      expect(dict.encodeOptional(DF.quad(
        DF.namedNode('ex:bob'),
        DF.namedNode('ex:says'),
        DF.quad(
          DF.namedNode('ex:carol'),
          DF.namedNode('ex:says'),
          DF.literal('Hello'),
        ),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 2);
      expect(dict.encodeOptional(DF.quad(
        DF.namedNode('ex:alice'),
        DF.namedNode('ex:says'),
        DF.quad(
          DF.namedNode('ex:bob'),
          DF.namedNode('ex:says'),
          DF.quad(
            DF.namedNode('ex:carol'),
            DF.namedNode('ex:says'),
            DF.literal('Hello'),
          ),
        ),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 3);
    });

    it('should encode mixed terms nodes', () => {
      expect(dict.encode(DF.namedNode('s'))).toEqual(0);
      expect(dict.encode(DF.blankNode('s'))).toEqual(1);
      expect(dict.encode(DF.literal('s'))).toEqual(2);
      expect(dict.encode(DF.quad(
        DF.namedNode('ex:alice'),
        DF.namedNode('ex:says'),
        DF.quad(
          DF.namedNode('ex:bob'),
          DF.namedNode('ex:says'),
          DF.quad(
            DF.namedNode('ex:carol'),
            DF.namedNode('ex:says'),
            DF.literal('Hello'),
          ),
        ),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 3);

      expect(dict.encode(DF.namedNode('s'))).toEqual(0);
      expect(dict.encode(DF.blankNode('s'))).toEqual(1);
      expect(dict.encode(DF.literal('s'))).toEqual(2);
      expect(dict.encode(DF.quad(
        DF.namedNode('ex:alice'),
        DF.namedNode('ex:says'),
        DF.quad(
          DF.namedNode('ex:bob'),
          DF.namedNode('ex:says'),
          DF.quad(
            DF.namedNode('ex:carol'),
            DF.namedNode('ex:says'),
            DF.literal('Hello'),
          ),
        ),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 3);
    });

    it('should throw for a quoted quad in the non-default graph', () => {
      expect(() => dict.encode(DF.quad(
        DF.namedNode('s'),
        DF.namedNode('p'),
        DF.namedNode('o'),
        DF.namedNode('othergraph'),
      ))).toThrow('Encoding of quoted quads outside of the default graph is not allowed');
    });
  });

  describe('encodeOptional', () => {
    it('should return undefined for non-encoded terms', () => {
      expect(dict.encode(DF.namedNode('ex:s1'))).toEqual(0);
      expect(dict.encode(DF.namedNode('ex:s2'))).toEqual(1);
      expect(dict.encode(DF.namedNode('ex:s3'))).toEqual(2);
      expect(dict.encode(DF.quad(
        DF.namedNode('ex:alice'),
        DF.namedNode('ex:says'),
        DF.quad(
          DF.namedNode('ex:bob'),
          DF.namedNode('ex:says'),
          DF.quad(
            DF.namedNode('ex:carol'),
            DF.namedNode('ex:says'),
            DF.literal('Hello'),
          ),
        ),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 3);

      expect(dict.encodeOptional(DF.namedNode('ex:s1'))).toEqual(0);
      expect(dict.encodeOptional(DF.namedNode('ex:s2'))).toEqual(1);
      expect(dict.encodeOptional(DF.namedNode('ex:s3'))).toEqual(2);
      expect(dict.encodeOptional(DF.namedNode('ex:s4'))).toEqual(undefined);
      expect(dict.encodeOptional(DF.quad(
        DF.namedNode('ex:alice'),
        DF.namedNode('ex:says'),
        DF.quad(
          DF.namedNode('ex:bob'),
          DF.namedNode('ex:says'),
          DF.quad(
            DF.namedNode('ex:carol'),
            DF.namedNode('ex:says'),
            DF.literal('Hello'),
          ),
        ),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 3);
    });
  });

  describe('decode', () => {
    it('should throw when entry does not exist', () => {
      expect(() => dict.decode(0)).toThrow('The value 0 is not present in this dictionary');
      expect(() => dict.decode(TermDictionaryQuoted.BITMASK | 1))
        .toThrow('The value -2147483647 is not present in the quoted triples range of the dictionary');
      expect(() => dict.decode(TermDictionaryQuoted.BITMASK | 10))
        .toThrow('The value -2147483638 is not present in the quoted triples range of the dictionary');
    });

    it('should decode encoded terms', () => {
      expect(dict.encode(DF.namedNode('s'))).toEqual(0);
      expect(dict.encode(DF.blankNode('s'))).toEqual(1);
      expect(dict.encode(DF.literal('s'))).toEqual(2);
      expect(dict.encode(DF.quad(
        DF.namedNode('s'),
        DF.namedNode('p'),
        DF.namedNode('o'),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 1);
      expect(dict.encode(DF.quad(
        DF.namedNode('s'),
        DF.namedNode('p'),
        DF.namedNode('o2'),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 2);
      expect(dict.encode(DF.quad(
        DF.namedNode('ex:alice'),
        DF.namedNode('ex:says'),
        DF.quad(
          DF.namedNode('ex:bob'),
          DF.namedNode('ex:says'),
          DF.quad(
            DF.namedNode('ex:carol'),
            DF.namedNode('ex:says'),
            DF.literal('Hello'),
          ),
        ),
      ))).toEqual(TermDictionaryQuoted.BITMASK | 5);

      expect(dict.decode(0)).toEqualRdfTerm(DF.namedNode('s'));
      expect(dict.decode(1)).toEqualRdfTerm(DF.blankNode('s'));
      expect(dict.decode(2)).toEqualRdfTerm(DF.literal('s'));
      expect(dict.decode(TermDictionaryQuoted.BITMASK | 1)).toEqualRdfTerm(DF.quad(
        DF.namedNode('s'),
        DF.namedNode('p'),
        DF.namedNode('o'),
      ));
      expect(dict.decode(TermDictionaryQuoted.BITMASK | 2)).toEqualRdfTerm(DF.quad(
        DF.namedNode('s'),
        DF.namedNode('p'),
        DF.namedNode('o2'),
      ));
      expect(dict.decode(TermDictionaryQuoted.BITMASK | 5)).toEqualRdfTerm(DF.quad(
        DF.namedNode('ex:alice'),
        DF.namedNode('ex:says'),
        DF.quad(
          DF.namedNode('ex:bob'),
          DF.namedNode('ex:says'),
          DF.quad(
            DF.namedNode('ex:carol'),
            DF.namedNode('ex:says'),
            DF.literal('Hello'),
          ),
        ),
      ));
    });
  });
});
