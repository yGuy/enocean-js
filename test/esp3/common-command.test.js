/* eslint-disable no-undef  */
import {
  CommonCommand,
  CO_WR_RESET,
  CO_WR_SLEEP,
  CO_RD_VERSION,
  CO_RD_SYS_LOG,
  CO_RD_IDBASE
} from '@enocean-js/common-command'
import ByteArray from '@enocean-js/byte-array'
import { Response } from '@enocean-js/esp3-packets'
const EO = require('../../')

describe('CommonCommand', () => {
  it('CO_WR_RESET', () => {
    var cc = CommonCommand.encode(CO_WR_RESET)
    expect(cc.commandType.name).toEqual('CO_WR_RESET')
    expect(cc.decode().commandCode).toEqual(CO_WR_RESET)
    expect(cc.decode().command).toEqual(cc.commandType.name)
  })
  it('CO_WR_SLEEP', () => {
    var args = ByteArray.from('00000000')
    args.setValue(900, 8, 24)
    var cc = CommonCommand.encode(CO_WR_SLEEP, args)
    expect(cc.commandType.name).toEqual('CO_WR_SLEEP')
    expect(cc.decode().period).toEqual(900)
    expect(cc.decode().commandCode).toEqual(CO_WR_SLEEP)
    expect(cc.decode().command).toEqual(cc.commandType.name)
  })
  it('CO_RD_VERSION', () => {
    var cc = CommonCommand.encode(CO_RD_VERSION)
    expect(cc.commandType.name).toEqual('CO_RD_VERSION')
    expect(cc.decode().commandCode).toEqual(CO_RD_VERSION)
    expect(cc.decode().command).toEqual(cc.commandType.name)
    var res = Response.encode(EO.RET_OK, ['010203ff', '040506ff', '00000001', '00000002', 'ENOCEAN'.padEnd(16, String.fromCharCode(0))])
    var ret = res.decode(cc.commandType.responseDefinition)
    expect(ret.appVersion.toString()).toEqual('010203ff')
    expect(ret.apiVersion.toString()).toEqual('040506ff')
    expect(ret.chipId.toString()).toEqual('00000001')
    expect(ret.chipVersion.toString()).toEqual('00000002')
    expect(ret.appDescription).toEqual('ENOCEAN')
  })
  it('CO_RD_SYS_LOG', () => {
    var cc = CommonCommand.encode(CO_RD_SYS_LOG)
    expect(cc.commandType.name).toEqual('CO_RD_SYS_LOG')
    expect(cc.decode().commandCode).toEqual(CO_RD_SYS_LOG)
    expect(cc.decode().command).toEqual(cc.commandType.name)
    var res = Response.encode(EO.RET_OK, '0102030405060708090a', 'f1f2f3f4f5f6f7f8f9fa')
    var ret = res.decode(cc.commandType.responseDefinition)
    expect(ret.apiLogCounter[0]).toEqual(1)
    expect(ret.apiLogCounter[9]).toEqual(10)
    expect(ret.appLogCounter[0]).toEqual(0xf1)
    expect(ret.appLogCounter[9]).toEqual(0xfa)
  })
  it('CO_RD_IDBASE', () => {
    var cc = CommonCommand.encode(CO_RD_IDBASE)
    expect(cc.commandType.name).toEqual('CO_RD_IDBASE')
    expect(cc.decode().commandCode).toEqual(CO_RD_IDBASE)
    expect(cc.decode().command).toEqual(cc.commandType.name)
    var res = Response.encode(EO.RET_OK, 'ff00aabb', '01')
    var ret = res.decode(cc.commandType.responseDefinition)
    expect(ret.baseId.toString()).toEqual('ff00aabb')
    expect(ret.remainingWriteCycles).toEqual(1)
  })
})
