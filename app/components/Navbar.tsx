'use client'
import Link from "next/link"
import supabase from "../config/supabaseClient"
import { useContext, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Session } from "../context/SessionContext";

/* Get info of current user */
async function getUserDisplayName() {
    const {data, error} = await supabase.auth.getUser()
    // console.log(data.user?.user_metadata.username)


    if(error || null){
        /* Receive error: AuthSessionMissingError: Auth session missing! 
        ** if no user is logged in (normal) */
        console.log(error)
        return null
    }
    return data.user?.user_metadata.username
}


export default function Navbar(){

    // Track the sessions of different users
    const {session, loading} = useContext(Session)
    const [loggedin, setisLoggedIn] = useState(false);
    const [userDisplayName, setUserDisplayName] = useState(null);

    useEffect(()=>{
        /* if a session is active */ 
        if(loading != true && session !=undefined){
            setisLoggedIn(true)
            setUserDisplayName(getUserDisplayName())
        }else{
            setisLoggedIn(false)
            setUserDisplayName(null)
        }
    },[session])

    const logout = async () =>{
        setisLoggedIn(false)
        setUserDisplayName(null)
        await supabase.auth.signOut();
        redirect('/items') 
    }

    return(
        <section>
            <nav className="menuNav">
                <Link href="/"><li>[Home Logo Here]</li></Link>
                <div className="menuRight">
                    <div>
                        <Link href="/items"><li>Auction Gallery</li></Link>
    
                        {/* view if logged in*/}
                        {loggedin &&  <Link href="/userProfile">[Profile]</Link>}
                       
                        {/* Toggle login / logout depending on status */}
                        {loggedin ? (
                            <Link href=""><button onClick={logout}><li className="logBtn">Logout</li></button></Link>
                        ):(
                            <Link href="/login"><li className="logBtn">Login</li></Link> 
                        )}
                    </div>
                    {/* Displays current user email logged in */}
                    { loggedin && <li>User: {userDisplayName}</li>}
                </div>   
            </nav>
        </section>
    )
}