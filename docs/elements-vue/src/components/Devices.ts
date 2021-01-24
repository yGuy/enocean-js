import {Device} from "@/components/Device";

export const devices: Device[] = [
    {
        name: 'Büro Schalter channel 1 - az-j',
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
        targets: [{eep:'d2-01-01', channel: 1, sender: 5}],
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
        validEeps: ['a5-3f-7feltakoshutters'],
        targets: [{eep:'a5-3f-7feltakoshutters', channel: 0, sender: 1},{eep:'d2-05-02', channel: 0, sender: 4}],
        channel: 1,
    },{
        name: 'AZ Jalousie channel 1',
        address: '019d5e88',
        validEeps: ['d2-05-02', 'F6-02-01'],
        targets: [{eep:'d2-05-02', channel: 0, sender: 2}],
        channel: 2,
        code: '6B48918A'
    },{
        name: 'EZ Jalousie vorne',
        address: '019d5a3c',
        validEeps: ['d2-05-02','F6-02-01'],
        targets: [{eep:'d2-05-02', channel: 0, sender: 4}, {eep:'f6-02-01', channel: 0, sender: 1 }],
        channel: 4,
        code:'1be00689',
    },{
        name: 'EZ Lichtband Seite',
        address: '050EF58D',
        validEeps: ['d2-05-00', 'F6-02-01'],
        targets: [{eep:'d2-05-00', channel: 0, sender: 3},{eep:'a5-38-08', channel: 0, sender: 3 }],
        code:'4242CAFE',
        channel: 3
    }, {
        name: 'Badfenster',
        address: '01a5fd1b',
        validEeps: ['d5-00-01'],
    }
]

export const BaseId: string = 'ffe70380'

