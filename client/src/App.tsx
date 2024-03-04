import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Main from "./components/Main";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <BrowserRouter>
                <AuthProvider>
                    <Header />
                    <Main />
                    <Footer />
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
