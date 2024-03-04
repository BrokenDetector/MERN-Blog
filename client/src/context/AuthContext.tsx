import { customFetch } from "@/utils/customFetch";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type TUser = {
	id?: string;
	username?: string;
	email: string;
	password: string;
	is_admin?: boolean;
};

export type TAuthContext = {
	user: TUser | null;
	signIn: (user: TUser) => void;
	logout: () => void;
	signUp: (user: TUser) => void;
	error: string | null;
	setError: (error: string) => void;
	loading: boolean;
	setUser: (user: TUser | null) => void;
};

export const AuthContext = createContext<TAuthContext | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<TUser | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	useEffect(() => {
		checkAuthentication();
	}, []);

	const checkAuthentication = () => {
		const token = localStorage.getItem("authToken");
		if (!token) {
			setUser(null);
			setLoading(false);
			return;
		}

		customFetch("/api/check-auth", {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error("Authentication failed");
				}
				return res.json();
			})
			.then((data) => {
				setUser(data);
			})
			.catch(() => {
				setUser(null);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const signIn = (user: TUser) => {
		setError(null);
		setLoading(true);
		customFetch("/api/sign-in", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(user),
		})
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					console.log(data);
				}  if (data.error) {
					setError(data.error);
				} else {
					setUser(data.user);
					localStorage.setItem("authToken", data.token);
					navigate("/");
				}
			})
			.catch((error) => {
				console.error("signIn failed:", error);
				setUser(null);
			})
			.finally(() => setLoading(false));
	};

	const logout = () => {
		setUser(null);
		localStorage.clear();
	};

	const signUp = (user: TUser) => {
		setError(null);
		setLoading(true);
		customFetch("/api/sign-up", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(user),
		})
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					console.log(data);
				} else if (data.error) {
					setError(data.error);
				} else {
					navigate("/sign-in");
				}
			})
			.catch((error) => {
				console.error(error);
				setError(error);
			})
			.finally(() => setLoading(false));
	};

	return (
		<AuthContext.Provider value={{ user, signIn, logout, signUp, error, setError, loading, setUser }}>{children}</AuthContext.Provider>
	);
};
