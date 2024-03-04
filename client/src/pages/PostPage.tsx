import CommentsSection from "@/components/CommentsSection";
import LoadingScreen from "@/components/Loading";
import { customFetch } from "@/utils/customFetch";
import "highlight.js/styles/github-dark-dimmed.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type TComment = {
	author: { username: string; _id: string };
	text: string;
	_id: string;
	createdAt: Date;
};

type TPost = {
	_id: string;
	title: string;
	content: string;
	comments: TComment[];
	author: { username: string };
	is_public: boolean;
	createdAt: Date;
};

export default function PostPage() {
	const params = useParams();
	const [post, setPost] = useState<TPost | null>(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		customFetch(`/api/post/${params.slug}`)
			.then((res) => {
				if (res.status === 404) return navigate("/404");
				return res.json();
			})
			.then((data) => setPost(data))
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	}, []);

	return (
		<>
			{loading ? (
				<LoadingScreen />
			) : (
				<div className="flex flex-col container mx-auto gap-6 my-20 justify-center">
					{post !== null && (
						<>
							<h1 className="text-5xl text-center text-bold p-4">{post.title}</h1>
							<time className="text-sm text-muted-foreground self-center mb-3">
								Published {new Date(post.createdAt).toLocaleDateString()}
							</time>

							<article
								className="prose prose-headings:text-accent-foreground text-accent-foreground prose-a:text-primary prose-slate prose-strong:text-accent-foreground md:prose-lg self-center"
								dangerouslySetInnerHTML={{ __html: post.content }}
							></article>

							<CommentsSection postId={post._id} />
						</>
					)}
				</div>
			)}
		</>
	);
}
