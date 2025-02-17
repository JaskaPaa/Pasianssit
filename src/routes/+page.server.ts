import { fail } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		game: await getData()
	};
};

export const actions = {
	/**
	 * Modify game state in reaction to a keypress. If client-side JavaScript
	 * is available, this will happen in the browser instead of here
	 */
	new: async ({ request, cookies }) => {
		

		const data = await request.formData();
		const key = data.get('key');
		
		return {baa: 282};
	},
} satisfies Actions;


async function getData() {
	const url = "https://sage-mochi-0d0608.netlify.app/api/random-game/32-32"; //games/1232";
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.json();
		console.log(json);
		return json;
	} catch (error) {
			console.error(error.message);
	}
}


/*

reuslt: 30-40 231/2624
reuslt: 41-45 666/2624
reuslt: 46-50 770/2624
reuslt: 51-60 732/2624
reuslt: 61-100 225/2624


231+666+770+732+225 === 2624

*/
    