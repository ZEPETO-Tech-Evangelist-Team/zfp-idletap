declare module "ZEPETO.Multiplay.Schema" {

	import { Schema, MapSchema, ArraySchema } from "@colyseus/schema"; 


	interface State extends Schema {
		schemaPlayers: MapSchema<SchemaPlayer>;
		schemaEnemy: SchemaEnemy;
	}
	class SchemaPlayer extends Schema {
		userId: string;
		attackCount: number;
	}
	class SchemaEnemy extends Schema {
		health: number;
	}
}