import {Device} from "@/components/Device";
import {RadioERP1} from "@enocean-js/radio-erp1";

export enum State {DISCONNECTED= "DISCONNECTED", CONNECTED = "CONNECTED", CONNECTING = "CONNECTING", ERROR = "ERROR"}
export type Message = {time: number, message: any}


type MessageListener = (arg: Message) => void;

type StateListener = (arg: {state: State}) => void;

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

    decode(message: string, devices: Device[]): any[] {
        const radio = RadioERP1.from(message)
        const results: any[] = []
        devices.filter(d => d.address.toLowerCase() === radio.senderId).forEach(d => {
            d.validEeps.forEach(eep => {
                eep = eep.toLowerCase()
                if (Number.parseInt(eep.substr(0,2), 16) === radio.RORG){
                    console.log('decode ' +message+  ' as ' + eep)
                    const decoded = radio.decode(eep, "1");
                    results.push({decoded, device:d})
                }
            })
        })
        return results;
    }

    disconnect() {
        if (this.webSocket){
            this.webSocket.close()
        }
    }
}

export const server = new Server();