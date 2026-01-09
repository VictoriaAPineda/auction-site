'use client'
import Link from "next/link"
import supabase from "../config/supabaseClient"
import { useContext, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Session } from "../context/SessionContext";

{/* Supabse -> Auth -> Sign in/Provideres -> unselect confirm email 
** or will get a Null bug for session info */}
async function getUserid() {
    const {data, error} = await supabase.auth.getUser()
    return data.user.id  
}
//  const id= getUserid()
//  console.log(id)


export default function Navbar(){
    // Track the sessions of different users
    const session = useContext(Session)

    const [loggedin, setisLoggedIn] = useState(false);

    useEffect(()=>{
        if(session.session == null){
            setisLoggedIn(false)
        }else{
            setisLoggedIn(true)
        }
    },[session])







    // console.log( session.session.user.id)

    const logout = async () =>{
        await supabase.auth.signOut();
        // window.location.reload();
        // redirect('/items') // put homepage later...
    }

    return(
        <section>
            <nav className="menuNav">
                <Link href="/"><li>[Home Logo Here]</li></Link>
                <div className="menuRight">
                    <div>
                        <Link href="/items"><li>Auction Gallery</li></Link>
                        <Link href="/sell"><li>Sell</li></Link>
                        {/* view if logged in*/}
                        <Link href="/userProfile">[Profile]</Link>
                        {/* Toggle login / logout*/}
                        {loggedin ? (
                            <Link href=""><button onClick={logout}><li className="logBtn">Logout</li></button></Link>
                        ):(
                            <Link href="/login"><li className="logBtn">Login</li></Link> 
                        )}
                        
                    </div>
                    {/* {session.session != null && <li>User: {session.session.user.email}</li> } */}
                </div>   
            </nav>
        </section>
    )
}