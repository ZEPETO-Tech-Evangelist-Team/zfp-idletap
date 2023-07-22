declare module "ZEPETO.Multiplay.Schema" {

	import { Schema, MapSchema, ArraySchema } from "@colyseus/schema"; 


	interface State extends Schema {
		schemaPlayers: MapSchema<SchemaPlayer>;
	}
	class SchemaPlayer extends Schema {
		userId: string;
		sessionId: string;
		name: string;
		attackCount: number;
	}
}