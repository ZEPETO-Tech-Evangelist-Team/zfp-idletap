declare module "ZEPETO.Multiplay.Schema" {

	import { Schema, MapSchema, ArraySchema } from "@colyseus/schema"; 


	interface State extends Schema {
		schemaPlayers: MapSchema<SchemaPlayer>;
		enemy: Enemy;
	}
	class SchemaPlayer extends Schema {
		userId: string;
		attackCount: number;
	}
	class Enemy extends Schema {
		health: number;
	}
}