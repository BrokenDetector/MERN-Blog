const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const customFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
	const response = await fetch(SERVER_URL + url, options);
	return response;
};
