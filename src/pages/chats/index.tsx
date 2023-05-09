import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/api";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ChatView from "~/components/ChatView";
import MessageView from "~/components/MessageView";
import { api } from "~/utils/api";


const MainContainer = () => {
    const router = useRouter();
    const id = router.asPath.slice(1);
    const { user, isSignedIn, isLoaded } = useUser();
    const [currentChat, setChat] = useState("");

    // this will never load unless the user directly navigates to this specific url without signing in
    if (!user) return <div>Something went wrong</div>


    return (
        <div className="w-full flex flex-row h-full">
            {isSignedIn &&
                <>
                    <div className="chats w-1/3"><ChatView userId={user.id} setChat={setChat} /></div>
                    <div className="message-window w-2/3 bg-gradient-to-b from-[#2e026d] to-[#15162c] h-full">
                        {
                            currentChat === "" &&
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-3xl text-gray-400">Select a chat or start new</p>
                            </div>
                        }
                        {
                            currentChat !== "" && <MessageView otherUserId={currentChat} userid={user.id} key={currentChat} />
                        }
                    </div>
                </>
            }
            {
                !isSignedIn && <div>Something went wrong</div>
            }
        </div>
    )
}


const Home: NextPage = () => {
    const { user, isSignedIn, isLoaded } = useUser();
    const router = useRouter();



    if (isSignedIn && user) {
        const { data: queryUser, isFetched } = api.users.createUserIfNotExist.useQuery({ userId: user.id });
        if (isFetched) {
            if (queryUser?.username === "" || !queryUser?.username) {
                router.push("./update_profile").finally(() => { console.log("redirected successfully") });
            }
        }
    }

    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white overflow-y-scroll">
                {isSignedIn && user &&
                    <MainContainer />
                }
                {
                    !isSignedIn &&
                    <div className="h-full w-full flex flex-col justify-center items-center">
                        <p className="text-3xl text-gray-400">Not Signed In</p>
                        <Link href=".." className="text-2xl underline">Home</Link>
                    </div>
                }
            </main>
        </>
    );
};



export default Home;