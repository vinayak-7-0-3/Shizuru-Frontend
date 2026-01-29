import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Custom500() {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Connection Failed | Shizuru Music</title>
            </Head>
            <div className="min-h-screen w-full flex items-center justify-center bg-neutral-100 dark:bg-black text-black dark:text-white relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-pink-500/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px]" />

                <div className="relative z-10 max-w-lg w-full mx-4">
                    <div className="backdrop-blur-xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                        {/* Icon */}
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                            <svg
                                className="w-10 h-10 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                                />
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                            Connection Failed
                        </h1>

                        <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
                            We couldn't connect to the backend server. It might be offline or undergoing maintenance.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => router.reload()}
                                className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-pink-500/25 transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Try Again
                            </button>

                            <button
                                onClick={() => router.push('/')}
                                className="w-full py-3 px-6 bg-white/10 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-white font-semibold rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 transition-all duration-200"
                            >
                                Go Home
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-white/10">
                            <p className="text-xs text-neutral-400 font-mono">
                                Error Code: 500 | Server Connection Refused
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
