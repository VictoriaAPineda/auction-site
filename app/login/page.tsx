'use client'
import { useEffect, useState } from "react";
import Auth from "../components/auth";
import supabase from "../config/supabaseClient";

export default function Login () {
    const [session, setSession] = useState<any>(null);

// maake this to a context....
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

    return(
        <>
            {/* User needs to sign in*/}
            <Auth />
        </>
    )  
}