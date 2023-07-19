import { Sandbox, SandboxOptions, SandboxPlayer } from "ZEPETO.Multiplay";

export default class extends Sandbox {

    onCreate(options: SandboxOptions) {
        this.onMessage("CLIENT_ATTACK_MESSAGE", (client: SandboxPlayer, message: number) => {
            // Triggers when 'action' message is sent.
            // Broadcast a message to all clients
            this.broadcast("SERVER_ATTACK_MESSAGE", message);
        });
    }

    onJoin(client: SandboxPlayer) {
        
    }

    onLeave(client: SandboxPlayer, consented?: boolean) {
        
    }
}