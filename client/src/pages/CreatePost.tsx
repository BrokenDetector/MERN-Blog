import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customFetch } from "@/utils/customFetch";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark-dimmed.css";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [fetching, setFetching] = useState(false);
	const ref = useRef<HTMLTextAreaElement>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (ref.current) {
			ref.current.style.height = "auto";
			ref.current.style.height = ref.current.scrollHeight + "px";
		}
	}, [content]);

	const marked = new Marked(
		markedHighlight({
			langPrefix: "hljs language-",
			highlight(code, lang) {
				const language = hljs.getLanguage(lang) ? lang : "plaintext";
				return hljs.highlight(code, { language }).value;
			},
		})
	);

	const sanitize = (value: any) => {
		return DOMPurify.sanitize(value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFetching(true);
		const post = { title, content: sanitize(marked.parse(content)) };
		customFetch("/api/create-post", {
			method: "post",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("authToken")}` },
			body: JSON.stringify(post),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) return;
				navigate("/");
			})
			.catch((err) => console.log(err))
			.finally(() => setFetching(false));
	};

	return (
		<div className="p-3 container mx-auto">
			<h1 className="text-center text-3xl my-6">Create post</h1>
			<form className="flex flex-col gap-4 container min-w-3xl" onSubmit={handleSubmit}>
				<div className="flex flex-col md:flex-row gap-8">
					<div className="flex-1 border-2 border-input rounded-xl p-5">
						<div className="flex flex-col gap-1">
							<label htmlFor="title" className="text-xl">
								Title
							</label>
							<Input
								type="text"
								className="border-input flex-1"
								placeholder="Title"
								onChange={(e) => setTitle(e.target.value)}
								value={title}
								required={true}
							/>
						</div>

						<div className="flex flex-col gap-1 mt-4">
							<label htmlFor="content">Content</label>
							<p className="text-xs text-muted-foreground italic">Supports Markdown</p>
							<textarea
								ref={ref}
								name="content"
								className="w-full min-h-96 rounded-lg p-3 border border-input resize-none bg-muted text-accent-foreground"
								onChange={(e) => {
									setContent(e.target.value);
								}}
								value={content}
								required={true}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-3 flex-1 border-2 border-input rounded-xl p-5">
						<h2 className="text-center text-xl">Preview:</h2>
						<div className="text-3xl flex flex-col gap-3">
							<h3 className="text-center md:text-4xl text-bold pb-4">{title}</h3>
							<article
								className="prose prose-headings:text-accent-foreground text-accent-foreground prose-a:text-primary prose-slate prose-strong:text-accent-foreground md:prose-md"
								dangerouslySetInnerHTML={{ __html: sanitize(marked.parse(content)) }}
							></article>
						</div>
					</div>
				</div>
				<Button type="submit" className="bg-primary w-fit self-center" disabled={fetching}>
					Publish
				</Button>
			</form>
		</div>
	);
}
