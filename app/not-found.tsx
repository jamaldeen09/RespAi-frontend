import Link from "next/link";

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center space-y-4">
                <div className="text-5xl text-foreground">404</div>
                <Link href="/" className="text-primary hover:underline text-sm">
                    Go home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;