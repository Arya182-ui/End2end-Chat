import { useEffect } from 'react';

const RedirectToPrivy = () => {
    useEffect(() => {
        window.location.href = 'https://privy-chat.onrender.com/';
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-[#0f172a] text-white">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Redirecting to Video Chat...</h2>
                <p className="text-gray-400">Please wait while we connect you to the secure server.</p>
            </div>
        </div>
    );
};

export default RedirectToPrivy;
