"use client"

import { useState } from "react";
import Image from "next/image";
import { Menu, Xmark } from "iconoir-react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function Navbar() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();
  const hideSignOut = pathname === "/" || pathname === "/auth/signup" || pathname === "/auth/signin";
  const [openMenu, setOpenMenu] = useState(false);
  
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
    setOpenMenu(false);
  }

  return (
    <div className="w-full flex flex-col gap-4">
    <nav className="w-full p-2 rounded flex justify-between bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600">
      <Image src="/drkist.png" alt="DRK Institute of Science and Technology Logo" width={40} height={40} className="rounded-full"/>
      <h1 className="text-4xl font-bold text-neutral-950 dark:text-neutral-50 cursor-pointer">
        <Link href="/">drkist</Link>
      </h1>
      <button className="cursor-pointer"
      onClick={() => setOpenMenu(!openMenu)}> 
      { openMenu ? (
       <Xmark width={40} height={40} className="text-neutral-950 dark:text-neutral-50" />
      ) : (
      <Menu width={40} height={40} className="text-neutral-950 dark:text-neutral-50" />
      )}
      </button>
    </nav>
    { openMenu && (
      <section className="w-full text-center p-2 flex flex-col gap-2 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600">
      <h1 className='text-3xl font-bold text-neutral-950 dark:text-neutral-50 cursor-pointer'>
          <Link href='/about' onClick={() => setOpenMenu(false)}>About</Link>
        </h1>
        {!hideSignOut && (
        <h1 
        className="text-3xl font-bold text-neutral-950 dark:text-neutral-50 cursor-pointer"
        onClick={handleSignOut}
        >Sign Out</h1>
        )}
      </section>
      )}
    </div>
    )
}