'use client'

import { ChangeEvent, FormEvent, useState } from "react"
import supabase from "../config/supabaseClient"

export default function Auth(){

    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Are they signing up? (new user)
        if(isSignUp){
            const {error :signUpError} = await supabase.auth.signUp({
                email, password,
            });
            if(signUpError){
                console.log("There was a error signing up", signUpError.message);
                return;
            }
        }else{ 
            // signing in (already a user)
            const {error : signInError} = await supabase.auth.signInWithPassword({
                email, password,
            })
            if(signInError){
                console.log("There was a sign in error", signInError.message);
                return;
            }
        }
  
    }

    return(
        <div>
            <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
            <form onSubmit={handleSubmit}>
                <input type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)} 
                />
                <input type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e:ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)}
                />
                <button type="submit">{isSignUp ? "Sign Up" : "Sign in"}</button>
            </form>

            <button onClick={()=>{setIsSignUp(!isSignUp)}}>{isSignUp ? "Switch to Sign In" : "Switch to Sign Up" }</button>

        </div>
    )
}