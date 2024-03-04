import LoadingScreen from "@/components/Loading";
import PostCard from "@/components/PostCard";
import { customFetch } from "@/utils/customFetch";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type TUser = {
	username: string;
};

type TPost = {
	_id: string;
	title: string;
	slug: string;
	content: string;
	author: TUser;
	is_public: boolean;
};

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [posts, setPosts] = useState<TPost[]>([]);

	useEffect(() => {
		customFetch("/api/posts")
			.then((res) => res.json())
			.then((data) => {
				setPosts(data.posts);
				setLoading(false);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div className="min-w-3xl flex flex-col gap-6">
			<div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
				<h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
				<p className="text-muted-foreground text-sm">
					Officia do velit sint in nostrud culpa eiusmod. Do occaecat eiusmod aliquip ex elit laborum sit et deserunt eiusmod
					dolore. Pariatur elit do id eu non minim ea qui culpa incididunt et est.
				</p>
				<Link to="/search" className="text-sm text-primary font-bold hover:underline">
					View all posts
				</Link>
			</div>
			{loading ? (
				<LoadingScreen />
			) : (
				<>
					{posts.length > 0 ? (
						<div className="flex flex-col justify-center">
							<div className="grid grid-cols-2 gap-4 mx-auto">
								{posts.map((post) => {
									return <PostCard post={post} key={post._id} />;
								})}
							</div>
							<Link to="/search" className="text-sm sm:text-sm text-primary font-bold hover:underline self-center py-4">
								View all posts
							</Link>
						</div>
					) : (
						<div className="flex flex-row items-center justify-center col-span-2 md:col-span-4">
							<h1 className="text-3xl">No posts</h1>
						</div>
					)}
				</>
			)}
		</div>
	);
}
