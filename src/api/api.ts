
const BASE_URL: string = import.meta.env.VITE_API_ENDPOINT;

interface User {
    id: number;
    name: string;
    email: string;

}

export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response: Response = await fetch(`${BASE_URL}/users`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: User[] = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error:', error);
        return [];
    }
};