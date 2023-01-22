export interface Map {
	mapId: number;
	name: string;
	author: string;
	type: string;
	marsballs: number;
	width: number;
	tiles: string;
}

export interface Player {
	auth: boolean;
	name: string;
	flair: number;
	degree: number;
	score: number;
	points: number;
	team: number;
	events: string;
}

export interface Team {
	name: string;
	score: number;
	splats: string;
}

export interface Match {
	matchId: number;
	server: string;
	port: number;
	official: boolean;
	group: string;
	date: number;
	timeLimit: number;
	duration: number;
	finished: boolean;
	mapId: number;
	players: Player[];
	teams: Team[];
}
