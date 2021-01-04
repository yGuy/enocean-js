/* eslint-disable no-undef  */
import ByteArray from '@enocean-js/byte-array'

describe('ByteArray', () => {
  it('SHOULD behave like an Array', () => {
    expect((new ByteArray()).length).toEqual(0)
    expect((new ByteArray(42)).length).toEqual(42)
    expect((new ByteArray(1, 2, 3, 4))[2]).toEqual(3)
    var a = new ByteArray()
    a.push(5)
    expect(a[0]).toEqual(5)
  })
  it('be able to turn strings into byte arrays', () => {
    var a = ByteArray.from('a1b2c3d4e5f6')
    expect(a.length).toEqual(6)
  })
  it('and arrays into strings', () => {
    var a = ByteArray.from('a1b2c3d4e5f6')
    expect(a.toString('hex')).toEqual('a1b2c3d4e5f6')
    a = ByteArray.from([1, 2, 3])
    expect(a.toString('hex')).toEqual('010203')
    a = ByteArray.from([1])
    expect(a.toString('hex')).toEqual('01')
    a = ByteArray.from('01')
    expect(a.toString('hex')).toEqual('01')
  })
  it(
    'SHOULD add a leading 0 when string does NOT contain an even number of chars',
    () => {
      expect(ByteArray.from('1').toString('hex')).toEqual('01')
    }
  )
  it(
    'SHOULD turn strings containing a chars that are not hex digits into an array of charcodes',
    () => {
      var a = ByteArray.from('XX')
      expect(a[0]).toEqual(88)
      expect(a[1]).toEqual(88)
    }
  )
  it('SHOULD have a setValue and getValue Method', () => {
    var ba = ByteArray.from('aaffaaff')
    for (var i = 0; i < 100; i++) {
      var r1 = Math.floor(Math.random() * 31)
      var r2 = Math.floor(Math.random() * (32 - r1))
      var v = Math.floor(Math.random() * (2 ** r2))
      ba.setValue(v, r1, r2)
      expect(ba.getValue(r1, r2)).toEqual(v)
    }
  })
  it('SHOULD allow to get single bits', () => {
    var ba = ByteArray.from('01')
    expect(ba.getSingleBit(7)).toEqual(1)
    expect(ba.getSingleBit(6)).toEqual(0)
    ba = ByteArray.from('010100')
    expect(ba.getSingleBit(15)).toEqual(1)
    expect(ba.getSingleBit(7)).toEqual(1)
    expect(ba.getSingleBit(6)).toEqual(0)
    expect(ba.getSingleBit(5)).toEqual(0)
    expect(ba.getSingleBit(4)).toEqual(0)
  })
  it('SHOULD be able to turn the array to various stringss', () => {
    var ba = ByteArray.from('010101')
    expect(ba.toString('hex')).toEqual('010101')
    expect(ba.toString(16)).toEqual('010101')
    expect(ba.toString(10)).toEqual('001001001')
    expect(ba.toString('dec')).toEqual('001001001')
    expect(ba.toString(2)).toEqual('000000010000000100000001')
    expect(ba.toString('bin')).toEqual('000000010000000100000001')
  })
  it('SHOULD allow for mixed creation of Arrays', () => {
    var a = ByteArray.from('55', [1, 2, 3], 4, [5, 6, ['ff', 7]])
    expect(a.toString('hex')).toEqual('55010203040506ff07')
  })
  it('Should allow to set Subarrays', () => {
    var a = ByteArray.from('00112233')
    a.set('aa', 2)
    expect(a.toString('hex')).toEqual('0011aa33')
    a.set('', 2)
    expect(a.toString('hex')).toEqual('0011aa33')
    a.set('aa')
    expect(a.toString('hex')).toEqual('aa11aa33')
  })
  it(
    'SHOULD turn numbers larger than 255 into a sequence of numbers smaller or equal to 255',
    () => {
      var a = ByteArray.from(0x11223344)
      expect(a.toString('hex')).toEqual('11223344')
    }
  )
  it(
    'SHOULD return an array with one element when constructd with a single number',
    () => {
      var a = ByteArray.from(0)
      expect(a.toString('hex')).toEqual('00')
    }
  )
  // it('SHOULD return ascii encoded strings by default', () => {
  //   var a = ByteArray.from(0x48414c4c4f)
  //   assert.equal(a.toString('ascii'), 'HALLO', '...')
  // })
})
