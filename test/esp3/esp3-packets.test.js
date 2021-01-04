/* eslint-disable no-undef  */
import ESP3Packet from '@enocean-js/esp3-packet'
import { pretty } from '@enocean-js/pretty-printer'

describe('ESP3Packet', () => {
  it('SHOULD be creatable with new', () => {
    var packet = new ESP3Packet()
    expect(packet.length).toEqual(0)
    expect(packet.constructor.name).toEqual('ESP3Packet')
  })
  it('SHOULD be creatable with a .from() function', () => {
    var packet = ESP3Packet.from([])
    expect(packet.length).toEqual(0)
  })
  it('SHOULD support a subset of Array methods', () => {
    var packet = ESP3Packet.from([])
    expect(packet.length).toEqual(0)
    packet.push(1, 2, 3)
    expect(packet.length).toEqual(3)
    expect(packet.toString()).toEqual('010203')
    packet.shift()
    expect(packet.toString()).toEqual('0203')
  })
  describe('when created from struct', () => {
    it('SHOULD return a default packet', () => {
      var packet = ESP3Packet.from({ data: [0] })
      expect(packet.packetType).toEqual(1)
      expect(packet.dataLength).toEqual(1)
      expect(packet.length).toEqual(8)
      expect(packet.toString()).toEqual('55000100016c0000')
      pretty.logESP3(packet)
    })
    it('SHOULD return a readable JSON when stringified', () => {
      var packet = ESP3Packet.from({ data: [8], packetType: 5 })
      expect(packet.toString()).toEqual('5500010005700838')
      var json = JSON.parse(JSON.stringify(packet))
      expect(json.header.dataLength).toEqual(1)
      expect(json.header.optionalLength).toEqual(0)
      expect(json.header.packetType).toEqual(5)
      expect(json.syncByte).toEqual(0x55)
      expect(json.data[0]).toEqual(8)
      expect(json.crc8Header).toEqual(0x70)
      expect(json.crc8Data).toEqual(0x38)
      expect(json.optionalData.length).toEqual(0)
    })
    it('SHOULD also handle optional Data', () => {
      var packet = ESP3Packet.from({ data: [1], optionalData: [2, 3] })
      expect(packet.packetType).toEqual(1)
      expect(packet.dataLength).toEqual(1)
      expect(packet.optionalLength).toEqual(2)
      expect(packet.length).toEqual(10)
      expect(packet.isPacketOK()).toEqual(true)
      expect(packet.slice(6, 9)[0]).toEqual(1)
      expect(packet.slice(6, 9)[1]).toEqual(2)
      expect(packet.slice(6, 9)[2]).toEqual(3)
    })
  })
})
