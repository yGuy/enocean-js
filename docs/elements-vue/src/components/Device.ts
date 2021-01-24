export type Target =  {eep:string, sender: number, channel: number}

export type Device = {
    validEeps: string[]
    name: string
    address: string
    channel?: number
    targets?: Target[]
    serverEep?: string
    code?: string
}