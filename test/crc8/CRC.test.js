/* eslint-disable no-undef  */
import { toCRC8, getCRC8 } from '@enocean-js/crc8'

describe('CRC8 Calculation', () => {
  describe('with getCRC8(buffer)', () => {
    it(
      'SHOULD turn any number of Bytes in a Buffer into a single Byte Checksum',
      () => {
        expect(getCRC8(Buffer.from([0x0]))).toEqual(0x0)
        expect(getCRC8(Buffer.from([0x0, 0x1]))).toEqual(0x7)
        expect(getCRC8(Buffer.from([0x2, 0x4, 0x7]))).toEqual(0x97)
        expect(getCRC8(Buffer.from([0x0, 0x1, 0x0, 0x5]))).toEqual(112)
      }
    )
    it('SHOULD work with regular Arrays', () => {
      expect(getCRC8([0x0])).toEqual(0x0)
      expect(getCRC8([0x0, 0x1])).toEqual(0x7)
      expect(getCRC8([0x2, 0x4, 0x7])).toEqual(0x97)
      expect(getCRC8([0x0, 0x1, 0x0, 0x5])).toEqual(112)
    })
    it('SHOULD work with Uint8Arrays', () => {
      expect(getCRC8(new Uint8Array([0x0]))).toEqual(0x0)
      expect(getCRC8(new Uint8Array([0x0, 0x1]))).toEqual(0x7)
      expect(getCRC8(new Uint8Array([0x2, 0x4, 0x7]))).toEqual(0x97)
      expect(getCRC8(new Uint8Array([0x0, 0x1, 0x0, 0x5]))).toEqual(112)
    })
  })
  describe('with buffer.reduce(toCRC8,0)', () => {
    it(
      'SHOULD turn any number of Bytes in a Buffer into a single Byte Checksum',
      () => {
        expect(Buffer.from([0x0]).reduce(toCRC8, 0)).toEqual(0x0)
        expect(Buffer.from([0x0, 0x1]).reduce(toCRC8, 0)).toEqual(0x7)
        expect(Buffer.from([0x2, 0x4, 0x7]).reduce(toCRC8, 0)).toEqual(0x97)
        expect(Buffer.from([0x0, 0x1, 0x0, 0x5]).reduce(toCRC8, 0)).toEqual(112)
      }
    )
    it('SHOULD work with regular Arrays', () => {
      expect([0x0].reduce(toCRC8, 0)).toEqual(0x0)
      expect([0x0, 0x1].reduce(toCRC8, 0)).toEqual(0x7)
      expect([0x2, 0x4, 0x7].reduce(toCRC8, 0)).toEqual(0x97)
      expect([0x0, 0x1, 0x0, 0x5].reduce(toCRC8, 0)).toEqual(112)
    })
    it('SHOULD work with Uint8Arrays', () => {
      expect((new Uint8Array([0x0])).reduce(toCRC8, 0)).toEqual(0x0)
      expect((new Uint8Array([0x0, 0x1])).reduce(toCRC8, 0)).toEqual(0x7)
      expect((new Uint8Array([0x2, 0x4, 0x7])).reduce(toCRC8, 0)).toEqual(0x97)
      expect((new Uint8Array([0x0, 0x1, 0x0, 0x5])).reduce(toCRC8, 0)).toEqual(112)
    })
  })
})
