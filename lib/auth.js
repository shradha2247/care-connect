// Simple auth functions using localStorage
export const login = (userData) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('user', JSON.stringify(userData));
	}
};

export const logout = () => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('user');
	}
};

export const getUser = () => {
	if (typeof window === 'undefined') return null;

	const user = localStorage.getItem('user');
	return user ? JSON.parse(user) : null;
};
