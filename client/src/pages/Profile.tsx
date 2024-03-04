import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthContext, TAuthContext } from "@/context/AuthContext";
import { customFetch } from "@/utils/customFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../components/ui/dialog";

const formSchema = z.object({
	username: z
		.string()
		.min(3, {
			message: "Username must be at least 3 characters.",
		})
		.max(50, { message: "Maximum length is 50" }),
	email: z.string().email({ message: "Invalid email address" }),
});

export function Profile() {
	const { user, setUser } = useContext(AuthContext) as TAuthContext;
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: user?.username,
			email: user?.email,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		try {
			const res = await customFetch("/api/update-user", {
				method: "post",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("authToken")}` },
				body: JSON.stringify({ username: values.username }),
			});
			if (res.ok) {
				const data = await res.json();
				navigate("/");
				setUser(data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			const res = await customFetch(`/api/delete-user/${user?.id}`, {
				method: "post",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("authToken")}` },
			});

			if (res.ok) {
				navigate(0);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<section className="bg-card mt-20 flex flex-col gap-5">
			<h1 className="text-3xl font-bold self-center">Edit Profile</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 border border-input p-8 rounded-xl flex flex-col justify-center"
				>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder="Username" type="text" {...field} disabled={loading} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Email" type="email" {...field} disabled={true} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={loading}>
						Save
					</Button>
				</form>
			</Form>
			<h1 className="ml-1 -mb-4 text-xl font-bold">Danger Zone</h1>
			<section className="border border-red-500 p-7 rounded-xl flex justify-center">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant={"outline"} className="text-red-600 border-red-500">
							Delete my account
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Delete user</DialogTitle>
							<DialogDescription>
								Are you sure you want to delete this user? This will also delete all posts and comments from that user.
							</DialogDescription>
						</DialogHeader>
						<div className="flex flex-col justify-start ml-3">
							<h1>{user!.username}</h1>
							<h2 className="text-muted-foreground">{user!.email}</h2>
						</div>
						<DialogFooter className="sm:justify-start">
							<DialogClose asChild>
								<Button className=" bg-red-600 hover:bg-red-500" onClick={handleDelete}>
									Yes, I'm sure
								</Button>
							</DialogClose>
							<DialogClose asChild>
								<Button variant={"outline"}>No, cancel</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</section>
		</section>
	);
}
