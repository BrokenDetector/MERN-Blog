import { AuthContext, TAuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { ModeToggle } from "./ui/mode-toggle";

export default function Header() {
    const { user, logout } = useContext(AuthContext) as TAuthContext;
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <header className="border border-input p-4 bg-muted">
            <div className="flex flex-wrap justify-between items-center container">
                <Link to={"/"} className=" text-xl flex font-bold self-center">
                    MERN Blog
                </Link>

                <form onSubmit={handleSubmit}>
                    <div className="hidden md:flex flex-row items-center bg-background rounded-lg">
                        <Input
                            type="text"
                            className="border-input"
                            placeholder="Search..."
                            id="title"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <AiOutlineSearch className=" h-9 w-8" />
                    </div>
                </form>

                <Button className="flex flex-row md:hidden" variant={"outline"}>
                    <Link to={"/search"}>Search</Link>
                    <AiOutlineSearch className="w-6 h-4" />
                </Button>

                <section className="flex flex-row justify-between gap-2 text-lg font-bold px-6 items-center">
                    <ModeToggle />
                    {user !== null ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex flex-row items-center text-sm gap-1">
                                    <CgProfile /> {user.username}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Link to={"/profile"}>Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem disabled={!user?.is_admin}>
                                    <Link to={"/dashboard"}>Admin Dashboard</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={!user?.is_admin}>
                                    <Link to={"/create-post"}>Create post</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            to={"/sign-in"}
                            className={buttonVariants({
                                variant: "outline",
                            })}
                        >
                            Sign in
                        </Link>
                    )}
                </section>
            </div>
        </header>
    );
}
