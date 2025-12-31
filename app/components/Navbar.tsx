import Link from "next/link"
export default function Navbar(){
    return(
        <section>
            <nav className="menuNav">
                <Link href="/"><li>[Home Logo Here]</li></Link>
                <div className="menuRight">
                    <Link href="/items"><li>Auction Gallery</li></Link>
                    <Link href="/sell"><li>Sell</li></Link>
                    {/* Toggle login / logout*/}
                    <Link href="#"><li className="logBtn">Login</li></Link> 
                </div>
            </nav>
        </section>
    )
}