import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export async function GET() {
	const number = await getData();

	return json(number);
}

export const POST: RequestHandler = async ({ request }) => {
	const { limits, id, random } = await request.json();
	console.log(limits);
	console.log(id);

	const game = await getData(limits, id, random);

	return json(game);
};

async function getData(limits = "", id: number, random: boolean) {

	//const url = "https://sage-mochi-0d0608.netlify.app/api/random-game/" + limits; //games/1232";
	let url;
	
	if (random)
		url = "https://sage-mochi-0d0608.netlify.app/api/random-game/" + limits; //games/1232";
	else 
    	url = "https://sage-mochi-0d0608.netlify.app/api/games/" + id; // 1474

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.json();
		console.log(json);
		return json;
	} catch (error: any) {
			console.error(error.message);
			return { error: error.message };
	}
}
