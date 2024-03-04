import { BsGithub } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="mt-auto py-3 h-fit text-center text-base items-center flex justify-center border border-input bg-muted gap-1">
            <h1>Made by</h1>
            <Link to="https://github.com/BrokenDetector" className="hover:underline">
                {" "}
                BrokenDetector
            </Link>
            <BsGithub className="size-5" />
        </footer>
    );
}
