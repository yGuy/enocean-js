import {Device} from "@/components/Device";

export const devices: Device[] = [
    {
        name: 'Büro Schalter',
        address: '002CD49C',
        validEeps: ['F6-02-01'],
    },
    {
        name: 'SZ Schalter r',
        address: '002FD61F',
        validEeps: ['F6-02-01'],
    },      {
        name: 'SZ Schalter l',
        address: '002FD287',
        validEeps: ['F6-02-01'],
    },{
        name: 'SZ Licht',
        address: '0507DFAE',
        validEeps: ['D2-01-01', 'F6-02-01'],
        channel: 5,
        code: '2451221e'
    },{
        name: 'Zentrale Schalter',
        address: 'FEF789A6',
        validEeps: ['F6-02-01'],
    },{
        name: 'EZ Jalousie Schalter',
        address: '0031C4B4',
        validEeps: ['F6-02-01'],
    },{
        name: 'AZ Rollo',
        address: '050EDEFC',
        validEeps: ['F6-02-01', 'a5-3f-7f'],
        channel: 1,
    },{
        name: 'AZ Jalousie',
        address: '019d5e88',
        validEeps: ['d2-05-00', 'F6-02-01'],
        channel: 2,
        code: '6B48918A'
    },{
        name: 'EZ Jalousie',
        address: '019d5a3c',
        validEeps: ['d2-05-00','F6-02-01'],
        channel: 4,
    },{
        name: 'EZ Jalousie',
        address: '050EF58D',
        validEeps: ['d2-05-00', 'F6-02-01'],
        code:'4242CAFE'
    }
]

