/* eslint-disable no-undef  */
// const ESP3Packet = require('../../').ESP3Packet
import {Response} from '@enocean-js/esp3-packets'
const EO = require('../../')
describe('Response packets', () => {
  it('...', () => {
    var packet = Response.encode(EO.RET_OK, 'ffa08700', 9)
    var desc = {
      0: [
        {
          name: 'baseId',
          location: 'data',
          offset: 1,
          length: 4,
          retFunc: x => x.toString('hex')
        }, {
          name: 'remainingWriteCycles',
          location: 'optionalData',
          offset: 0,
          length: 1,
          retFunc: x => parseInt(x.toString(), 'hex')
        }, {
          name: 'test2',
          location: 'optionalData',
          retFunc: x => x
        }, {
          name: 'test3',
          value: 123
        }
      ]
    }
    var res = packet.decode(desc)
    expect(res.baseId).toEqual('ffa08700')
    expect(res.remainingWriteCycles).toEqual(9)
    expect(res.test2[0]).toEqual(9)
    expect(res.test3).toEqual(123)

    packet.decode()
    expect(res.returnCode).toEqual(0)
    expect(res.returnMsg).toEqual('RET_OK')
  })
})
