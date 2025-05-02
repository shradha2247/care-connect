// Simple auth functions using localStorage
export const login = (userData) => {
	localStorage.setItem('user', JSON.stringify(userData));
};

export const logout = () => {
	localStorage.removeItem('user');
};

export const getUser = () => {
	if (typeof window === 'undefined') return null;

	const user = localStorage.getItem('user');
	return user ? JSON.parse(user) : null;
};

export const checkRole = (allowedRoles) => {
	const user = getUser();
	if (!user) return false;
	return allowedRoles.includes(user.role);
};
