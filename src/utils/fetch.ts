import axios from 'axios';
import { load } from 'cheerio';

export function fetchStream<T>(url: string, params?: T) {
	return axios
		.get<NodeJS.ReadableStream>(url, {
			params,
			responseType: 'stream',
		})
		.then((res) => res.data);
}

export async function fetchHtml<T>(url: string, params?: T) {
	const { data } = await axios.get(url, { params });

	return load(data);
}
