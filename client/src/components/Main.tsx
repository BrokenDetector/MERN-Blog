import NotFound from "@/pages/404";
import CreatePost from "@/pages/CreatePost";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import PostPage from "@/pages/PostPage";
import { Profile } from "@/pages/Profile";
import Search from "@/pages/Search";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import UpdatePost from "@/pages/UpdatePost";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

export default function Main() {
	return (
		<main className="flex justify-center m-5 h-auto">
			<Routes>
				<Route path="/post/:slug" element={<PostPage />} />
				<Route path="/sign-up" element={<SignUp />} />
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/search" element={<Search />} />
				<Route element={<ProtectedRoute requireAdmin={true} />}>
					<Route path="/post/update/:id" element={<UpdatePost />} />
					<Route path="/create-post" element={<CreatePost />} />
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>
				<Route element={<ProtectedRoute requireAdmin={false} />}>
					<Route path="/profile" element={<Profile />} />
				</Route>
				<Route path="/" element={<Home />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</main>
	);
}
