import * as EEP from '../../packages/node_modules/@enocean-js/eep-transcoder/src/eep.js'
import {RadioERP1}  from "../../packages/node_modules/@enocean-js/radio-erp1";
import {assert} from 'chai'

let radio, decoded

describe('RadioERP1 packets', () => {
  it('SHOULD be creatable from ESP3Packets', () => {
    var radio = RadioERP1.from({ data: 'f630aabbccdd30', optionalData: '03ffffffffff00', packetType: 1 })
    assert.equal(radio.packetType, 1)
    assert.equal(radio.RORG, 0xf6, 'RORG')
    assert.equal(radio.payload[0], 0x30)
    assert.equal(radio.senderId, 'aabbccdd')
    assert.equal(radio.status, 0x30)
    assert.equal(radio.T21, 1, 'T21')
    assert.equal(radio.NU, 1, 'NU')
    assert.equal(radio.subTelNum, 3)
    assert.equal(radio.destinationId, 'ffffffff')
    assert.equal(radio.RSSI, 0xff)
    assert.equal(radio.securityLevel, 0)
    assert.equal(radio.teachIn, true)
    assert.equal(radio.decode('f6-02-03').RA.value, 0x30)
  })
  it('SHOULD be manipulable with interface methods', () => {
    var radio = RadioERP1.from({ payload: '00000000' })
    radio.RORG = 0xa5
    radio.payload = 0xaabbccdd
    assert.equal(radio.payload.toString(), 'aabbccdd')
    radio.status = 0
    assert.equal(radio.status, 0x0)
    radio.T21 = 1
    assert.equal(radio.T21, 1, 'T21')
    radio.NU = 1
    assert.equal(radio.NU, 1, 'NU')
    assert.equal(radio.status, 0x30)
    radio.senderId = 'ccddeeff'
    assert.equal(radio.senderId, 'ccddeeff')
    radio.subTelNum = 3
    assert.equal(radio.subTelNum, 3)
    radio.destinationId = 0xaaaaaaaa
    assert.equal(radio.destinationId, 'aaaaaaaa', 'destination')
    radio.RSSI = 0x80
    assert.equal(radio.RSSI, 0x80)
    radio.securityLevel = 1
    assert.equal(radio.securityLevel, 1)
    radio = RadioERP1.from({ payload: '00' })
    assert.equal(radio.RORG, 0xf6, '1BS')
    radio = RadioERP1.from({ payload: '0000000000' })
    assert.equal(radio.RORG, 0xd2, 'VLD')
  })
  it('SHOULD allow to create learn telegrams (UTE)', () => {
    var radio = RadioERP1.from('55000d0701fdd480ff61000050d2050e0ed10001ffffffff360051')
    var decoded = radio.decode()
    assert.equal(decoded.eep.toString(), 'd2-50-00')
    assert.equal(decoded.senderId, '050e0ed1')
  })
  it('SHOULD allow to create learn telegrams (4BS)', () => {
    var radio = RadioERP1.makeTeachIn({ eep: 'a5-02-0a' })
    var decoded = radio.decode()
    assert.equal(decoded.eep.func, 0x02)
    assert.equal(decoded.eep.type, 0x0a)
    assert.equal(decoded.manufacturer.id, 0x7ff)
    assert.equal(decoded.eep.toString(), 'a5-02-0a')
    assert.equal(decoded.teachInType, '4BS')
  })
  it('SHOULD allow to create learn telegrams (1BS)', () => {
    var radio = RadioERP1.makeTeachIn({ eep: 'd5-00-01', senderId: 'aabbccdd' })
    var decoded = radio.decode()
    assert.equal(decoded.senderId, 'aabbccdd')
    assert.equal(decoded.eep.toString(), 'd5-00-01')
    assert.equal(decoded.teachInType, '1BS')
  })
  it('SHOULD type: 1BS', () => {
    radio = RadioERP1.makeTeachIn({ type: '1BS', eep: 'd5-00-01' })
    decoded = radio.teachInInfo
    assert.equal(decoded.senderId, '00000000')
    assert.equal(decoded.teachInType, '1BS')
  })
  it('SHOULD allow to create learn telegrams (RPS)', () => {
    var radio = RadioERP1.makeTeachIn({ eep: 'f6-02-01', senderId: 'aabbccdd' })
    var decoded = radio.teachInInfo
    assert.equal(decoded.senderId, 'aabbccdd')
    assert.equal(decoded.eep.toString(), 'f6-02-01')
    assert.equal(decoded.teachInType, 'RPS')

    radio = RadioERP1.makeTeachIn({ eep: 'f6-02-01', senderId: 'aabbccdd', RORG: 0xf6 })
    decoded = radio.teachInInfo
    assert.equal(decoded.senderId, 'aabbccdd')
    assert.equal(decoded.eep.toString(), 'f6-02-01')
    assert.equal(decoded.teachInType, 'RPS')
  })
  it('SHOULD Type: RPS', () => {
    radio = RadioERP1.makeTeachIn({ type: 'RPS', eep: 'f6-02-03' })
    decoded = radio.teachInInfo
    assert.equal(decoded.senderId, '00000000')
    assert.equal(decoded.eep.toString(), 'f6-02-01')
    assert.equal(decoded.teachInType, 'RPS')
  })
  describe('EEP decoding', () => {
    it('Value in single byte with reversed scale', () => {
      radio = RadioERP1.from({ payload: '0000ff08' })
      decoded = radio.decode('a5-02-01')
      assert.equal(decoded.TMP.value, -40)
    })
    it('Value in spread across bytes 10bit', () => {
      radio = RadioERP1.from({ payload: '00000008' })
      decoded = radio.decode('a5-02-30')
      assert.equal(decoded.TMP.value, 62.3)
    })
    it('multible values each in single byte', () => {
      radio = RadioERP1.from({ payload: [0, 250, 250, 0x08] })
      decoded = radio.decode('a5-04-02')
      assert.equal(decoded.TMP.value, 60)
      assert.equal(decoded.HUM.value, 100)
    })
    it('Enum values with range', () => {
      radio = RadioERP1.from({ payload: [100, 0, 0, 0x08] })
      decoded = radio.decode('a5-10-1f')
      assert.equal(decoded.FAN.min, 0)
      assert.equal(decoded.FAN.max, 144)
    })
    it('Enum with single value', () => {
      radio = RadioERP1.from({ payload: [0x11] })
      decoded = radio.decode('f6-05-01')
      assert.equal(decoded.WAS.value, 0x11)
      radio = RadioERP1.from({ payload: [0x21] })
      decoded = radio.decode('f6-05-01')
      assert.equal(decoded.WAS.value, null)
    })
    it('eep with complete ref to other eep', () => {
      radio = RadioERP1.from({ payload: [250, 0, 0, 0x08] })
      decoded = radio.decode('a5-10-1e')
      assert.equal(decoded.SV.value, 5)
    })
    it('decodes based on status with ref', () => {
      radio = RadioERP1.from('55000707017af640019d5a3c3001ffffffff2e00fa')
      decoded = radio.decode('F6-02-01')
      assert.equal(decoded.SV.value, 5)
    })
    it('eep bitmask enum', () => {
      radio = RadioERP1.from({ payload: 0xd0, status: 0x20, RORG: 0xf6 })
      decoded = radio.decode('f6-10-00')
      assert.equal(decoded.WIN.description, 'up')
      radio = RadioERP1.from({ payload: 192, status: 0x20 })
      decoded = radio.decode('f6-10-00')
      assert.equal(decoded.WIN.description, 'left/right')
    })
    it('values with scale/unit point to other fields', () => {
      radio = RadioERP1.from({ payload: [0, 0, 0, 0x08] })
      radio.encode({ DT: 0, DIV: 1, MR: 0.1 }, { eep: 'a5-12-01' })
      decoded = radio.decode('a5-12-01')
      assert.equal(decoded.MR.value, 0.1, 'scale 1/10')
      assert.equal(decoded.MR.unit, 'kWh', 'unit kWh')

      radio = RadioERP1.from({ payload: [0, 0, 1, 0x08] })
      radio.encode({ DT: 2, DIV: 0, MR: 1 }, { eep: 'a5-12-01' })
      decoded = radio.decode('a5-12-01')
      assert.equal(decoded.MR.value, 1, 'scale 1/1')
      assert.equal(decoded.MR.unit, 'W', 'unit W')

      radio = RadioERP1.from({ payload: [0, 0, 0, 0x08] })
      radio.encode({ DIV: 2, MR: 345.67 }, { eep: 'a5-12-01' })
      decoded = radio.decode('a5-12-01')
      assert.equal(decoded.MR.value, 345.67, 'scale 1/100')
    })
    it('various EEPs', () => {
      radio = RadioERP1.from({ payload: [0x02, 0x00, 0x0a, 0x0a] })
      decoded = radio.decode('a5-09-05')
      assert.equal(decoded.Conc.value, 512)
      radio = RadioERP1.from({ payload: [0x0f, 0x02, 0x00, 0x0a] })
      decoded = radio.decode('a5-09-0b')
      assert.equal(decoded.Ract.value.toFixed(1), 51.2)
    })
    it('RPS with different status codes', () => {
      radio = RadioERP1.from({ payload: 0, status: 0x30 })
      decoded = radio.decode('f6-02-01')
      assert.equal('SA' in decoded, true)
      radio = RadioERP1.from({ payload: 0, status: 0x20 })
      decoded = radio.decode('f6-02-01')
      assert.equal('SA' in decoded, false)
    })
    it('4BS with direction', () => {
      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      decoded = radio.decode('a5-11-05', 1)
      assert.equal('WM' in decoded, false)
      decoded = radio.decode('a5-11-05', 2)
      assert.equal('WM' in decoded, true)
    })
    it('a5-12-10', () => {
      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      radio.encode({ DT: 1, DIV: 2, MR: 50.5 }, { eep: 'a5-12-10' })
      decoded = radio.decode('a5-12-10')
      assert.equal(decoded.MR.value, 50.5)
      assert.equal(decoded.MR.unit, 'mA')
      radio.encode({ DT: 0, DIV: 0, MR: 5000 }, { eep: 'a5-12-10' })
      decoded = radio.decode('a5-12-10')
      assert.equal(decoded.MR.unit, 'A.h')
      assert.equal(decoded.MR.value, 5000)
    })
    it('MSB-LSB splited fields', () => {
      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      radio.encode({ LOT: 90, LAT: 0, ID: 6 }, { eep: 'a5-13-06', data: 6 })
      decoded = radio.decode('a5-13-06')
      assert.equal(decoded.LOT.value.toFixed(0), 90)
      assert.equal(decoded.LAT.value.toFixed(0), 0)

      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      radio.encode({ SRA: 1900 }, { eep: 'a5-13-10' })
      decoded = radio.decode('a5-13-10')
      assert.equal(decoded.SRA.value, 1900)
    })
    it('a5-20-10', () => {
      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      radio.encode({ CVAR: 90 }, { eep: 'a5-20-10', direction: 2 })
      decoded = radio.decode('a5-20-10', 2)
      assert.equal(decoded.CVAR.value, 90)
    })
    it('a5-38-08', () => {
      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      radio.encode({ COM: 1, TIM: 100 }, { eep: 'a5-38-08', data: 1 })
      decoded = radio.decode('a5-38-08')
      assert.equal(decoded.TIM.value.toFixed(0), 100)

      radio = RadioERP1.from({ payload: [0x00, 0x00, 0x00, 0x08] })
      radio.encode({ COM: 2, EDIM: 50 }, { eep: 'a5-38-08', data: 2 })
      decoded = radio.decode('a5-38-08')
      assert.equal(decoded.EDIM.value.toFixed(0), 50)
    })
  })
  describe('creating teach in telegrams', () => {
    it('1BS', () => {
      radio = RadioERP1.from({ rorg: 'd5', payload: [0], id: 'ff00ff00' })
      radio.payload.setValue(0, 4, 1)
      assert.equal(radio.teachIn, true)
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

      assert.equal(radio.packetType, 1)
      assert.equal(radio.RORG, 0xf6, 'RORG')
      assert.equal(radio.payload[0], 0x50)
      assert.equal(radio.senderId, '002cd49c')
      assert.equal(radio.status, 0x30)
      assert.equal(radio.T21, 1, 'T21')
      assert.equal(radio.NU, 1, 'NU')
      assert.equal(radio.subTelNum, 1)
      assert.equal(radio.destinationId, 'ffffffff')
      assert.equal(radio.RSSI, 0x4a)
      assert.equal(radio.securityLevel, 0)
      //assert.equal(radio.decode('f6-02-01').RA.value, 0x30)

      console.log(decoded = radio.decode('f6-02-01'))

      radio = RadioERP1.from({ payload: [0], id: '002cd49c' })
      radio.encode({
        R1:2,
        EB: 1,
        R2: 0,
        SA: 0,
      }, { eep: 'f6-02-01', channel: 0 })
      radio.RSSI = 0x4a
      radio.subTelNum = 1
      radio.fixPacket()
      assert.equal(radio.toString(),
          '55000707017af650002cd49c3001ffffffff4a005e')


      radio = RadioERP1.from({ payload: [0], id: 'ff00ff00' })
      radio.encode({ MT: 0, RMT: 1 }, { eep: 'd2-50-00'})
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


      assert.equal(decoded.CH1.value, 0.9)
      assert.equal(decoded.CH2.value, 0.5)
      assert.equal(decoded.CH3.value, 1.8)
      // console.log(setValueFieldName(50, 'a5-38-08', 'EDIM', ByteArray.from([0, 0, 0, 0]), 2))
    })
  })
  for (let eep in EEP) {
    const desc = EEP[eep]
    for (let c in desc.case) {
      const case_ = desc.case[c];
      it('roundtrips ' + eep + " case " + c, () => {

        function eep2JSON(c, eep, channel) {
          var msg = {
            'data': {},
            'meta': {
              'eep': eep,
              'channel': channel
            }
          }

          c.datafield && c.datafield.forEach(item => {
            if (!item.reserved) {
              if (item.enum && item.enum.item) {
                if (item.shortcut === "LRNB") {
                  msg.data[item.shortcut] = 1;
                } else if (Array.isArray(item.enum.item)) {
                  const val = parseInt(item.enum.item[0].value)
                  msg.data[item.shortcut] = isNaN(val) ? 0 : val;
                } else {
                  const val = parseInt(item.enum.item.value)
                  msg.data[item.shortcut] = isNaN(val) ? 0 : val;
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
        const rorg = parseInt(eep.substr(0, 2), 16);
        const radio = RadioERP1.from({rorg, payload: [0], id: 'ff00ff00'})
        const data = radio.encode(json.data, {eep: json.meta.eep.eep, channel, direction: json.meta.direction, status: json.meta.status})
        const radioDecoded = RadioERP1.from(radio.toString())
        const decoded = radioDecoded.decode(json.meta.eep.eep, json.meta.direction)
        const radio2 = RadioERP1.from({rorg, payload: [0], id: 'ff00ff00'})
        const data2 = radio2.encode(decoded, {eep: json.meta.eep.eep, channel, direction: json.meta.direction, status: json.meta.status})

        assert.equal(radio.toString(), radio2.toString())
      })
    }
  }
})
