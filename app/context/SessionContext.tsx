'use client'

import { ReactNode, createContext, useEffect, useState } from "react"
import supabase from "../config/supabaseClient";

export const Session = createContext<any>(null);

const SessionContext = ({ children } :{children:ReactNode}) => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // maake this to a context....to share over siete of current user session instead of login
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
            <Session value={{session, loading}}>
                {children}
            </Session>
        )  
    }
    export default SessionContext;