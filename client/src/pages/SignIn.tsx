import { buttonVariants } from "@/components/ui/button";
import { SignInForm } from "@/components/ui/signin-form";
import { AuthContext, TAuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
    const { user, loading } = useContext(AuthContext) as TAuthContext;
    const navigate = useNavigate();
    useEffect(() => {
        if (user !== null && !loading) return navigate("/");
    });
    return (
        <div className="mt-10 min-h-full p-3 max-w-3xl gap-5 flex md:items-center">
            <section className="flex-1">
                <h1 className=" text-4xl flex font-bold self-center">MERN Blog</h1>
                <p className="text-sm mt-5">
                    Dolor duis nostrud qui eiusmod id fugiat eiusmod. Mollit ad eiusmod nisi nisi nisi tempor incididunt.
                </p>
            </section>

            <section className="border border-input rounded-xl p-8 bg-card flex-1">
                <SignInForm />
                <div className="text-sm mt-5">
                    Dont have an account?
                    <Link className={buttonVariants({ variant: "link" })} to={"/sign-up"}>
                        <h1 className="text-primary"> Sign up</h1>
                    </Link>
                </div>
            </section>
        </div>
    );
}
