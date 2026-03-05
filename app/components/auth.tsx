'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { redirect } from "next/navigation"

/* Check for duplicates of username (must be unique)*/
async function compareUsername(un:string) {
    try {
        const {data, error} = await supabase 
        .from('profiles')
        .select('*')
        .eq('username', un)
        .single()

        if(data){
            // If matched, this is NOT a unique username
            return false
        }else{
            // If no matche, means this is a UNIQUE username
            return true
        }
    } catch (error) {
            console.log('Error in username search: ', error)
    }
}


export default function Auth(){

    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState<string>('')
    const [isUsernameUnqiue, setIsUsernameUnqiue] = useState<boolean | undefined>(true)

    useEffect(()=>{
        compareUsername(username).then( (r => setIsUsernameUnqiue(r)))
    },[username])

    console.log(isUsernameUnqiue)
    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Are they signing up? (new user)
        if(isSignUp){
            // TODO: prevent submission is still matched with one in db
            // if(!isUsernameUnqiue){
            //     return 
            // }

            const {error :signUpError, data} = await supabase.auth.signUp({
                email, 
                password,
                options: {
                    // username will be stored in 'profiles' table
                    data: { username : username},
                },
            });
            if(signUpError){
                console.log("There was a error signing up: ", signUpError.message);
                return;
            }
            redirect('/items')
        }else{ 
            // Signing in (already a user)
            const {error : signInError} = await supabase.auth.signInWithPassword({
                email, password,
            })
            if(signInError){
                console.log("There was a sign in error", signInError.message);
                return;
            }
            //reload -> redirect
            redirect('/items')
        }
    }
    return(
        <div>
            {/* TODO: Change the look of form for sign in...*/}
            <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" 
                    value={username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                        setUsername(e.target.value)}/>
                { !isUsernameUnqiue && <p>Already in use </p> }
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