export default function NotFound() {
    return (
        <div className="text-center flex items-center flex-col mt-20">
            <h1 className="text-9xl font-bold mb-5">
                404
                <br />
                <span className="text-5xl font-bold mb-5">NOT FOUND</span>
            </h1>
            <p className="italic">The requested content has not been found.</p>
        </div>
    );
}