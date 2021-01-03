export class Device {
    validEeps: string[] = []
    name: string = ''
    address: string = '00000000'
    channel?: number
    serverEep?: string
    code?: string = ''
}