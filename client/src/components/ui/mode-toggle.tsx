import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { BsSun } from "react-icons/bs";
import { FaMoon } from "react-icons/fa";

export function ModeToggle() {
    const { setTheme } = useTheme();

    return (
        <Button variant="outline" size="icon" className="rounded-full">
            <BsSun
                className="h-[1.4rem] w-[1.4rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                onClick={() => setTheme("dark")}
            />
            <FaMoon
                className="absolute h-[1.4rem] w-[1.4rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                onClick={() => setTheme("light")}
            />
        </Button>
    );
}
