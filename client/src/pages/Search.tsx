import LoadingScreen from "@/components/Loading";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { customFetch } from "@/utils/customFetch";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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

export default function Search() {
	const [posts, setPosts] = useState<TPost[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const location = useLocation();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);

		const fetchPosts = async () => {
			setLoading(true);
			const searchQuery = urlParams.toString();
			const res = await customFetch(`/api/posts?${searchQuery}`);
			if (!res.ok) {
				setLoading(false);
				return;
			}
			if (res.ok) {
				const data = await res.json();
				setPosts(data.posts);
				setLoading(false);
				setTotalCount(data.totalCount);
				setPage((prevPage) => prevPage + 1);
			}
		};
		fetchPosts();
	}, [location.search]);

	const handleShowMore = async () => {
		const urlParams = new URLSearchParams(location.search);
		const searchQuery = urlParams.toString();
		const res = await customFetch(`/api/posts?${searchQuery}&page=${page}`);
		if (!res.ok) {
			return;
		}
		if (res.ok) {
			const data = await res.json();
			setPosts((prev) => [...prev, ...data.posts]);
			setTotalCount(data.totalCount);
			setPage((prevPage) => prevPage + 1);
		}
	};

	return (
		<div>
			{loading ? (
				<LoadingScreen />
			) : (
				<>
					{posts.length > 0 ? (
						<div className="flex flex-col">
							<h1 className="text-3xl font-semibold sm:border-b border-input p-3">Posts results:</h1>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto pt-3">
								{posts.map((post) => {
									return <PostCard post={post} key={post._id} />;
								})}
							</div>
							{posts.length === 9 && totalCount !== posts.length && (
								<Button
									variant={"link"}
									onClick={handleShowMore}
									className="text-sm text-primary font-bold self-center py-4"
								>
									Show more
								</Button>
							)}
						</div>
					) : (
						<div className="flex flex-row items-center justify-center col-span-2 md:col-span-4">
							<h1>No posts</h1>
						</div>
					)}
				</>
			)}
		</div>
	);
}
