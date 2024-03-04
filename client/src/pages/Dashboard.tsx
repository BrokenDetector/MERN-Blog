import DashComments from "@/components/DashComments";
import DashPots from "@/components/DashPots";
import DashUsers from "@/components/DashUsers";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Dashboard() {
    const location = useLocation();
    const [selectedItem, setSelectedItem] = useState(() => new URLSearchParams(location.search).get("tab") || "posts");

    const handleItemClick = (value: string) => {
        setSelectedItem(value);
    };

    return (
        <div className="flex flex-col border borer-input m-10 p-5 w-dvw rounded-lg">
            <NavigationMenu
                className="border-b border-input flex flex-wrap justify-between items-center container list-none dashboard mb-4"
                defaultValue="posts"
            >
                <NavigationMenuItem className={selectedItem === "posts" ? "selected" : ""} onClick={() => handleItemClick("posts")}>
                    <Link to="/dashboard?tab=posts">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Posts</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className={selectedItem === "comments" ? "selected" : ""} onClick={() => handleItemClick("comments")}>
                    <Link to="/dashboard?tab=comments">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Comments</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className={selectedItem === "users" ? "selected" : ""} onClick={() => handleItemClick("users")}>
                    <Link to="/dashboard?tab=users">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Users</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenu>
            <section>
                {selectedItem === "posts" && <DashPots />}
                {selectedItem === "comments" && <DashComments />}
                {selectedItem === "users" && <DashUsers />}
            </section>
        </div>
    );
}
