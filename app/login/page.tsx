

'use client'
import { useEffect, useState } from "react";
import Auth from "../components/auth";
import supabase from "../config/supabaseClient";


export default function Login () {
    const [session, setSession] = useState<any>(null);

    const fetchSession = async () =>{
        const currentSession = await supabase.auth.getSession();
        // supbase gets the sesssion (value : if user is logged in OR not)
        setSession(currentSession);
    }
    useEffect(()=>{
        fetchSession();
        // supabase listens to event
        // automactically switches states
        const {data: authListener} = supabase.auth.onAuthStateChange(
            (_event, session)=> {
                setSession(session)
            }
        );
        return() => {
            // clean up after subscription to prevent 
            // memnory leaks
            authListener.subscription.unsubscribe();
        }
    },[])

    const logout = async () =>{
        await supabase.auth.signOut();
    }

    return(
        <>
            <p> This is the Sign in page </p>
           
            {session ? (
                <>
                    {/* User is currently signed in */}
                    <button onClick={logout}>Log Out</button>
                </>
            ): (
                <>
                    {/* User needs to sign in*/}
                    <Auth />
                </>
            )}
        </>
    )  
}