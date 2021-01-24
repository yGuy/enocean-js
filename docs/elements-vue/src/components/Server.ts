import {Device} from "@/components/Device";
import {RadioERP1} from "@enocean-js/radio-erp1";
import {Case, decodeAll, Eep, encodeData} from "@enocean-js/eep-transcoder";

export enum State {DISCONNECTED= "DISCONNECTED", CONNECTED = "CONNECTED", CONNECTING = "CONNECTING", ERROR = "ERROR"}
export type Message = {time: number, message: any}


type MessageListener = (arg: Message) => void;

type StateListener = (arg: {state: State}) => void;

type DecodeResult = { eep: Eep, eepCase: Case, data: any}

class Server {
    get state(): State {
        return this._state;
    }

    set state(value: State) {
        this._state = value;
        this.stateChange(value);
    }
    private listeners: MessageListener[] = [];
    private stateListeners: StateListener[] = [];
    webSocket: WebSocket|undefined;
    private _state: State = State.DISCONNECTED;

    constructor(){

        this.connect("ws://raspberrypi.fritz.box:1880/ws/enocean")
    }

    public messages: Message[] = [];

    connect(connection: string){
        this.message('Connecting')
        try {
            this.webSocket = new WebSocket(connection);
            this.state = State.CONNECTING
            this.webSocket.addEventListener("open", ev => {
                this.state = State.CONNECTED
                this.message('Connected')
            })
            this.webSocket.addEventListener("close", ev => {
                this.state = State.DISCONNECTED
                delete this.webSocket;
                this.message('Closed')
            })
            this.webSocket.addEventListener("error",  ev => {
                this.state = State.ERROR
                this.message('Error')
            })
            this.webSocket.addEventListener("message",   ev => {
                this.message(ev.data)
            })
        } catch (e){
            this.message('Error '+e)
        }
    }

    send(message: any){
        if (this.state === State.CONNECTED && this.webSocket){
            this.webSocket.send(message)
            this.message(message)
        }
    }

    message(data: any){
        let message = {time: Date.now(), message: data};
        this.messages.push(message)
        this.listeners.forEach(l => l(message))
        console.log(message)
    }

    stateChange(state: State){
        this.stateListeners.forEach(l => l({state}))
    }

    addMessageListener(listener: MessageListener){
        this.listeners.push(listener)
    }

    removeMessageListener(listener: MessageListener){
        const index = this.listeners.indexOf(listener)
        if (index >= 0){
            this.listeners.splice(index, 1)
        }
    }

    addStateListener(listener: StateListener){
        this.stateListeners.push(listener)
    }

    removeStateListener(listener: StateListener){
        const index = this.stateListeners.indexOf(listener)
        if (index >= 0){
            this.stateListeners.splice(index, 1)
        }
    }

    decode(message: string, devices: Device[]): DecodeResult[] {
        const radio = RadioERP1.from(message.toLowerCase())
        const results: DecodeResult[] = []
        devices.filter(d => d.address.toLowerCase() === radio.senderId).forEach(d => {
            d.validEeps.forEach(eep => {
                eep = eep.toLowerCase()
                if (Number.parseInt(eep.substr(0,2), 16) === radio.RORG){
                    results.push(decodeAll(radio, eep, "1"))
                }
            })
        })
        return results;
    }

    encode({eep, eepCase, sender, data, destination}: {eep:Eep, eepCase:Case, sender: number | string, destination?: string, data: any}): string {
        let radioERP1 = RadioERP1.from({ rorg: parseInt(eep.rorg_number, 16), payload:'', id: sender })
        radioERP1.encode(data, {eepCase})
        destination && (radioERP1.destinationId = destination)
        return radioERP1.toString()
    }

    disconnect() {
        if (this.webSocket){
            this.webSocket.close()
        }
    }

    clear() {
        this.messages.length = 0
    }
}

export const server = new Server();

function parseValue(v: string): number {
    let radix;
    try {
        radix = v.toString().substr(0, 2)
    } catch (err) {
        console.log(v)
        return 0
    }
    switch (radix) {
        case '0b':
            return parseInt(v.replace('0b', ''), 2)
        case '0x':
            return parseInt(v.replace('0x', ''), 16)
        case '0o':
            return parseInt(v.replace('0o', ''), 8)
        default:
            return parseInt(v)
    }
}

export function parse(value: number | string | undefined): Number {
    if (typeof value === "string") {
        return parseValue(value);
    } else if (typeof value === "number") {
        return value
    } else {
        return 0;
    }
}

export function arrayOrSingle<T>(el: T[] | T): T[] {
    return Array.isArray(el) ? el : [el]
}