import { Link } from "react-router-dom";

type TPostProps = {
	post: TPost;
};
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

export default function PostCard({ post }: TPostProps) {
	return (
		<>
			<Link
				to={`/post/${post.slug}`}
				className="w-[300px] md:w-[350px] lg:w-[400px] min-h-[200px] border border-input shadow-sm hover:bg-accent hover:text-accent-foreground rounded-lg flex flex-col gap-3 p-6 hover:scale-110 duration-200 justify-center"
			>
				<h1 className="font-bold text-lg">{post.title}</h1>
				<h2 className="text-gray-600">{post.author.username}</h2>
			</Link>
		</>
	);
}
