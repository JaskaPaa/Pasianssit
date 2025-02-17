import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export async function GET() {
	const number = await getData();

	return json(number);
}

export const POST: RequestHandler = async ({ request }) => {
	const { limits } = await request.json();
	console.log(limits);

	const game = await getData(limits);

	return json(game);
};

async function getData(limits = "") {

	//const url = "https://sage-mochi-0d0608.netlify.app/api/random-game/" + limits; //games/1232";
    const url = "https://sage-mochi-0d0608.netlify.app/api/games/1474";
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
