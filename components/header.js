import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";

export default function Header(){

    return(
        <header id="main-header">
        <Link href="/">
            <Image 
                priority
                src={logo} 
                alt="Moile phone with posts feed on it"/>
        </Link>
        <nav>
            <ul>
                <li>
                    <Link href="/feed">Feed</Link>
                </li>
                <li>
                    <Link href="/new-post" className="cta-link">New Post</Link>
                </li>
            </ul>
        </nav>

    </header>
    )
}