import { EEP } from '@enocean-js/eep-transcoder'
import { RadioERP1 } from '@enocean-js/radio-erp1'

import { describe, expect, it } from '@jest/globals'

let radio, decoded

describe('RadioERP1 packets', () => {
  it('SHOULD be creatable from ESP3Packets', () => {
    var radio = RadioERP1.from({ data: 'f630aabbccdd30', optionalData: '03ffffffffff00', packetType: 1 })
    expect(radio.packetType).toEqual(1)
    expect(radio.RORG).toEqual(0xf6)
    expect(radio.payload[0]).toEqual(0x30)
    expect(radio.senderId).toEqual('aabbccdd')
    expect(radio.status).toEqual(0x30)
    expect(radio.T21).toEqual(1)
    expect(radio.NU).toEqual(1)
    expect(radio.subTelNum).toEqual(3)
    expect(radio.destinationId).toEqual('ffffffff')
    expect(radio.RSSI).toEqual(0xff)
    expect(radio.securityLevel).toEqual(0)
    expect(radio.teachIn).toEqual(true)
    expect(radio.decode('f6-02-03').RA.value).toEqual('0x30')
  })
  it('SHOULD be manipulable with interface methods', () => {
    var radio = RadioERP1.from({ payload: '00000000' })
    radio.RORG = 0xa5
    radio.payload = 0xaabbccdd
    expect(radio.payload.toString()).toEqual('aabbccdd')
    radio.status = 0
    expect(radio.status).toEqual(0x0)
    radio.T21 = 1
    expect(radio.T21).toEqual(1)
    radio.NU = 1
    expect(radio.NU).toEqual(1)
    expect(radio.status).toEqual(0x30)
    radio.senderId = 'ccddeeff'
    expect(radio.senderId).toEqual('ccddeeff')
    radio.subTelNum = 3
    expect(radio.subTelNum).toEqual(3)
    radio.destinationId = 0xaaaaaaaa
    expect(radio.destinationId).toEqual('aaaaaaaa')
    radio.RSSI = 0x80
    expect(radio.RSSI).toEqual(0x80)
    radio.securityLevel = 1
    expect(radio.securityLevel).toEqual(1)
    radio = RadioERP1.from({ payload: '00' })
    expect(radio.RORG).toEqual(0xf6)
    radio = RadioERP1.from({ payload: '0000000000' })
    expect(radio.RORG).toEqual(0xd2)
  })
  it('SHOULD allow to create learn telegrams (UTE)', () => {
    var radio = RadioERP1.from('55000d0701fdd480ff61000050d2050e0ed10001ffffffff360051')
    var decoded = radio.decode()
    expect(decoded.eep.toString()).toEqual('d2-50-00')
    expect(decoded.senderId).toEqual('050e0ed1')
  })
  it('SHOULD allow to create learn telegrams (4BS)', () => {
    var radio = RadioERP1.makeTeachIn({ eep: 'a5-02-0a' })
    var decoded = radio.decode()
    expect(decoded.eep.func).toEqual(0x02)
    expect(decoded.eep.type).toEqual(0x0a)
    expect(decoded.manufacturer.id).toEqual(0x7ff)
    expect(decoded.eep.toString()).toEqual('a5-02-0a')
    expect(decoded.teachInType).toEqual('4BS')
  })
  it('SHOULD allow to create learn telegrams (1BS)', () => {
    var radio = RadioERP1.makeTeachIn({ eep: 'd5-00-01', senderId: 'aabbccdd' })
    var decoded = radio.decode()
    expect(decoded.senderId).toEqual('aabbccdd')
    expect(decoded.eep.toString()).toEqual('d5-00-01')
    expect(decoded.teachInType).toEqual('1BS')
  })
  it('SHOULD type: 1BS', () => {
    radio = RadioERP1.makeTeachIn({ type: '1BS', eep: 'd5-00-01' })
    decoded = radio.teachInInfo
    expect(decoded.senderId).toEqual('00000000')
    expect(decoded.teachInType).toEqual('1BS')
  })
  it('SHOULD allow to create learn telegrams (RPS)', () => {
    var radio = RadioERP1.makeTeachIn({ eep: 'f6-02-01', senderId: 'aabbccdd' })
    var decoded = radio.teachInInfo
    expect(decoded.senderId).toEqual('aabbccdd')
    expect(decoded.eep.toString()).toEqual('f6-02-01')
    expect(decoded.teachInType).toEqual('RPS')

    radio = RadioERP1.makeTeachIn({ eep: 'f6-02-01', senderId: 'aabbccdd', RORG: 0xf6 })
    decoded = radio.teachInInfo
    expect(decoded.senderId).toEqual('aabbccdd')
    expect(decoded.eep.toString()).toEqual('f6-02-01')
    expect(decoded.teachInType).toEqual('RPS')
  })
  it('SHOULD Type: RPS', () => {
    radio = RadioERP1.makeTeachIn({ type: 'RPS', eep: 'f6-02-03' })
    decoded = radio.teachInInfo
    expect(decoded.senderId).toEqual('00000000')
    expect(decoded.eep.toString()).toEqual('f6-02-01')
    expect(decoded.teachInType).toEqual('RPS')
  })
  describe('EEP decoding', () => {
    it('Value in single byte with reversed scale', () => {
      radio = RadioERP1.from({ payload: '0000ff08' })
      decoded = radio.decode('a5-02-01')
      expect(decoded.TMP.value).toEqual(-40)
    })
    it('Value in spread across bytes 10bit', () => {
      radio = RadioERP1.from({ payload: '00000008' })
      decoded = radio.decode('a5-02-30')
      expect(decoded.TMP.value).toEqual(62.3)
    })
    it('multible values each in single byte', () => {
      radio = RadioERP1.from({ payload: [0, 250, 250, 0x08] })
      decoded = radio.decode('a5-04-02')
      expect(decoded.TMP.value).toEqual(60)
      expect(decoded.HUM.value).toEqual(100)
    })
    it('Enum values with range', () => {
      radio = RadioERP1.from({ payload: [100, 0, 0, 0x08] })
      decoded = radio.decode('a5-10-1f')
      expect(decoded.FAN.min).toEqual('0')
      expect(decoded.FAN.max).toEqual('144')
    })
    it('Enum with single value', () => {
      radio = RadioERP1.from({ payload: [0x11] })
      decoded = radio.decode('f6-05-01')
      expect(decoded.WAS.value).toEqual('0x11')
      radio = RadioERP1.from({ payload: [0x21] })
      decoded = radio.decode('f6-05-01')
      expect(decoded.WAS.value).toBeUndefined()
    })
    it('eep with complete ref to other eep', () => {
      radio = RadioERP1.from({ payload: [250, 0, 0, 0x08] })
      decoded = radio.decode('a5-10-1e')
      expect(decoded.SV.value).toEqual(5)
    })
    it('eep bitmask enum', () => {
      radio = RadioERP1.from({ payload: 0xd0, status: 0x20, RORG: 0xf6 })
      decoded = radio.decode('f6-10-00')
      expect(decoded.WIN.description).toEqual('up')
      radio = RadioERP1.from({ payload: 192, status: 0x20 })
      decoded = radio.decode('f6-10-00')
      expect(decoded.WIN.description).toEqual('left/right')
    })
    it('values with scale/unit point to other fields', () => {
      radio = RadioERP1.from({ payload: [0, 0, 0, 0x08] })
      radio.encode({ DT: 0, DIV: 1, MR: 0.1 }, { eep: 'a5-12-01' })
      decoded = radio.decode('a5-12-01')
      expect(decoded.MR.value).toEqual(0.1)
      expect(decoded.MR.unit).toEqual('kWh')

      radio = RadioERP1.from({ payload: [0, 0, 1, 0x08] })
      radio.encode({ DT: 2, DIV: 0, MR: 1 }, { eep: 'a5-12-01' })
      decoded = radio.decode('a5-12-01')
      expect(decoded.MR.value).toEqual(1)
      expect(decoded.MR.unit).toEqual('W')

      radio = RadioERP1.from({ payload: [0, 0, 0, 0x08] })
      radio.encode({ DIV: 2, MR: 345.67 }, { eep: 'a5-12-01' })
      decoded = radio.decode('a5-12-01')
      expect(decoded.MR.value).toEqual(345.67)
    })
    it('various EEPs', () => {
      radio = RadioERP1.from({ payload: [0x02, 0x00, 0x0a, 0x0a] })
      decoded = radio.decode('a5-09-05')
      expect(decoded.Conc.value).toEqual(512)
      radio = RadioERP1.from({ payload: [0x0f, 0x02, 0x00, 0x0a] })
      decoded = radio.decode('a5-09-0b')
      expect(decoded.Ract.value.toFixed(1)).toEqual('51.2')
    })
    it('RPS with different status codes', () => {
      radio = RadioERP1.from({ payload: 0, status: 0x30 })
      decoded = radio.decode('f6-02-01')
      expect('SA' in decoded).toEqual(true)
      radio = RadioERP1.from({ payload: 0, status: 0x20 })
      decoded = radio.decode('f6-02-01')
      expect('SA' in decoded).toEqual(false)
    })
    it('4BS with direction', () => {
      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      decoded = radio.decode('a5-11-05', 1)
      expect('WM' in decoded).toEqual(false)
      decoded = radio.decode('a5-11-05', 2)
      expect('WM' in decoded).toEqual(true)
    })
    it('a5-12-10', () => {
      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      radio.encode({ DT: 1, DIV: 2, MR: 50.5 }, { eep: 'a5-12-10' })
      decoded = radio.decode('a5-12-10')
      expect(decoded.MR.value).toEqual(50.5)
      expect(decoded.MR.unit).toEqual('mA')
      radio.encode({ DT: 0, DIV: 0, MR: 5000 }, { eep: 'a5-12-10' })
      decoded = radio.decode('a5-12-10')
      expect(decoded.MR.unit).toEqual('A.h')
      expect(decoded.MR.value).toEqual(5000)
    })
    it('MSB-LSB splited fields', () => {
      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      radio.encode({ LOT: 90, LAT: 0, ID: 6 }, { eep: 'a5-13-06' })
      decoded = radio.decode('a5-13-06')
      expect(decoded.LOT.value.toFixed(0)).toEqual('90')
      expect(decoded.LAT.value.toFixed(0)).toEqual('0')

      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      radio.encode({ SRA: 1900 }, { eep: 'a5-13-10' })
      decoded = radio.decode('a5-13-10')
      expect(decoded.SRA.value).toEqual(1900)
    })
    it('a5-20-10', () => {
      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      radio.encode({ CVAR: 90 }, { eep: 'a5-20-10', direction: 2 })
      decoded = radio.decode('a5-20-10', 2)
      expect(decoded.CVAR.value).toEqual(90)
    })
    it('a5-38-08', () => {
      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      radio.encode({ COM: 1, TIM: 100 }, { eep: 'a5-38-08' })
      decoded = radio.decode('a5-38-08')
      expect(decoded.TIM.value.toFixed(0)).toEqual('100')

      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      radio.encode({ COM: 2, EDIM: 50 }, { eep: 'a5-38-08' })
      decoded = radio.decode('a5-38-08')
      expect(decoded.EDIM.value.toFixed(0)).toEqual('50')
    })
  })
  describe('creating teach in telegrams', () => {
    it('1BS', () => {
      radio = RadioERP1.from({ rorg: 'd5', payload: [0], id: 'ff00ff00' })
      radio.payload.setValue(0, 4, 1)
      expect(radio.teachIn).toEqual(true)
    })
  })
  describe('EEP encoding', () => {
    it('d2', () => {
      radio = RadioERP1.from('55000a0701ebd264640004019d5a3c0001ffffffff35001d')
      console.log(decoded = radio.decode('d2-05-02'))
      radio = RadioERP1.from('55000a0701ebd263580004019d5a3c0001ffffffff40003a')
      console.log(decoded = radio.decode('d2-05-02'))

      radio = RadioERP1.from('55000707017af600002cd49c2001ffffffff4c0093')
      console.log(decoded = radio.decode('f6-02-01'))
      //                           55000707017af6400507dfae3001ffffffff4a00b4
      radio = RadioERP1.from('55000707017af650002cd49c3001ffffffff4a005e')

      expect(radio.packetType).toEqual(1)
      expect(radio.RORG).toEqual(0xf6)
      expect(radio.payload[0]).toEqual(0x50)
      expect(radio.senderId).toEqual('002cd49c')
      expect(radio.status).toEqual(0x30)
      expect(radio.T21).toEqual(1)
      expect(radio.NU).toEqual(1)
      expect(radio.subTelNum).toEqual(1)
      expect(radio.destinationId).toEqual('ffffffff')
      expect(radio.RSSI).toEqual(0x4a)
      expect(radio.securityLevel).toEqual(0)
      // assert.equal(radio.decode('f6-02-01').RA.value, 0x30)

      console.log(decoded = radio.decode('f6-02-01'))

      radio = RadioERP1.from({ payload: [0], id: '002cd49c' })
      radio.encode({
        R1: 2,
        EB: 1,
        R2: 0,
        SA: 0
      }, { eep: 'f6-02-01', channel: 0 })
      radio.RSSI = 0x4a
      radio.subTelNum = 1
      radio.fixPacket()
      expect(radio.toString()).toEqual('55000707017af650002cd49c3001ffffffff4a005e')

      radio = RadioERP1.from({ payload: [0], id: 'ff00ff00' })
      radio.encode({ MT: 0, RMT: 1 }, { eep: 'd2-50-00' })
      radio.senderId = 'ff00ff00'
      decoded = radio.decode('d2-50-00')

      radio = RadioERP1.from({ payload: [0], id: 'ff00ff00' })
      radio.encode({ POS: 31, ANG: 47, REPO: 0, LOCK: 0, CHN: 0, CMD: 1 }, { eep: 'd2-05-00', channel: 3 })
      radio.senderId = 'ff00ff00'
      decoded = radio.decode('d2-05-00')

      radio = RadioERP1.from('55000a0701ebd264000004050ef58d0001ffffffff4900ec')
      decoded = radio.decode('d2-05-00')

      radio = RadioERP1.from('55000c070196d240009005012001a03d790001ffffffff5600d5')
      decoded = radio.decode('d2-32-02')

      expect(decoded.CH1.value).toEqual(0.9)
      expect(decoded.CH2.value).toEqual(0.5)
      expect(decoded.CH3.value).toEqual(1.8)
      // console.log(setValueFieldName(50, 'a5-38-08', 'EDIM', ByteArray.from([0, 0, 0, 0]), 2))
    })
  })
  const table = Object.entries(EEP).filter(([name, desc]) => Array.isArray(desc.case)).flatMap(([name, desc]) => desc.case.map((case_, i) => ([name, i, desc, case_])))
  describe.each(table)('Roundtrip %s Case %i', (eep, index, desc, case_) => {
    function eep2JSON (c, eep, channel) {
      var msg = {
        data: {},
        meta: {
          eep: eep,
          channel: channel
        }
      }

      c.datafield && c.datafield.forEach(item => {
        if (!item.reserved) {
          if (item.enum && item.enum.item) {
            if (item.shortcut === 'LRNB') {
              msg.data[item.shortcut] = 1
            } else if (Array.isArray(item.enum.item)) {
              const val = parseInt(item.enum.item[0].value)
              msg.data[item.shortcut] = isNaN(val) ? 0 : val
            } else {
              const val = parseInt(item.enum.item.value)
              msg.data[item.shortcut] = isNaN(val) ? 0 : val
            }
          } else if (item.scale) {
            msg.data[item.shortcut] = parseInt(item.scale.min)
          } else {
            msg.data[item.shortcut] = 0
          }
        }
      })
      if (c.condition && c.condition.statusfield) {
        msg.meta.status = parseInt(`00${c.condition.statusfield[0].value}${c.condition.statusfield[1].value}0000`, 2)
      }
      if (c.condition && c.condition.direction) {
        msg.meta.direction = parseInt(c.condition.direction)
      }
      return msg
    }

    const channel = 3
    const json = eep2JSON(case_, desc, 3)
    const rorg = parseInt(eep.substr(0, 2), 16)
    const radio = RadioERP1.from({ rorg, payload: [0], id: 'ff00ff00' })
    const data = radio.encode(json.data, {
      eep: json.meta.eep.eep,
      channel,
      direction: json.meta.direction,
      status: json.meta.status
    })
    const radioDecoded = RadioERP1.from(radio.toString())
    const decoded = radioDecoded.decode(json.meta.eep.eep, json.meta.direction)
    const radio2 = RadioERP1.from({ rorg, payload: [0], id: 'ff00ff00' })
    const data2 = radio2.encode(decoded, {
      eep: json.meta.eep.eep,
      channel,
      direction: json.meta.direction,
      status: json.meta.status
    })

    expect(data).toEqual(data2)

    expect(radio.toString()).toEqual(radio2.toString())
  })
})
