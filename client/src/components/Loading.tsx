import { FadeLoader } from "react-spinners";

function LoadingScreen() {
    return (
        <div className="flex flex-col justify-center items-center text-center p-5">
            <FadeLoader color="#3879e4" radius={10} />
        </div>
    );
}

export default LoadingScreen;
