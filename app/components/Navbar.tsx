'use client'
import Link from "next/link"
import supabase from "../config/supabaseClient"
import { useContext, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Session } from "../context/SessionContext";

/* Get info of current user */
async function getUserEmail() {
    const {data, error} = await supabase.auth.getUser()
    if(error || null){
        /* Receive error: AuthSessionMissingError: Auth session missing! 
        ** if no user is logged in (normal) */
        console.log(error)
        return null
    }
    return data.user.email
}

export default function Navbar(){

    // Track the sessions of different users
    const {session, loading} = useContext(Session)
    const [loggedin, setisLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(null);

    useEffect(()=>{
        /* if a session is active */ 
        if(loading != true && session !=undefined){
            setisLoggedIn(true)
            setUserEmail(getUserEmail())
        }else{
            setisLoggedIn(false)
            setUserEmail(null)
        }
    },[session])

    const logout = async () =>{
        setisLoggedIn(false)
        setUserEmail(null)
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
                        {/* {loggedin && <Link href="/sell"><li>Sell</li></Link>} */}
                        {loggedin &&  <Link href="/userProfile">[Profile]</Link>}
                       
                        {/* Toggle login / logout depending on status */}
                        {loggedin ? (
                            <Link href=""><button onClick={logout}><li className="logBtn">Logout</li></button></Link>
                        ):(
                            <Link href="/login"><li className="logBtn">Login</li></Link> 
                        )}
                    </div>
                    {/* Displays current user email logged in */}
                    { loggedin && <li>User: {userEmail}</li>}
                </div>   
            </nav>
        </section>
    )
}