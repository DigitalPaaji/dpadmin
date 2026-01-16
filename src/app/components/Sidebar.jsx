'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
// import { useGlobalContext } from './context/GlobalContext'
import {

  Package,
  PlusSquare,
 GraduationCap ,
  Menu,
 Building2 ,
  LogOut,
} from 'lucide-react'
import PopupModal from './ConfirmPopup'

// Updated nav items with correct icons
const navItems = [

  { name: 'All Blogs', href: '/blogs', icon: Package },
  { name: 'Add Blogs', href: '/blogs/add', icon: PlusSquare },
   { name: 'Company Blogs', href: '/blogs/company', icon: Building2  },
   { name: 'Academy Blogs', href: '/blogs/academy', icon: GraduationCap  },

]

function Sidebar() {

  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
const route= useRouter()


  const fetchAdmin = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_PORT}/admin`,
      {
        method: "GET",
        credentials: "include", 
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch admin");
    }

    const data = await response.json();
  if(data.success){

  }else{
    route.push('/auth/login')
  }
  
} catch (error) {
  route.push('/auth/login');
  }
};




  useEffect(() => {
    fetchAdmin()
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setCollapsed(true) // auto collapse on mobile
      }
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const logoutAdmin= async()=>{
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/admin/logout`,{
         credentials: "include",
      })
      const data = await response.json();
      if(data.success){
        route.push("/auth/login")
      }
    } catch (error) {
      
    }
  }

  return (
    <div>
      <aside
        className={`
          sticky min-h-screen z-50 top-0 left-0
          ${collapsed ? 'w-20' : 'w-64'}
          transition-all duration-300
          px-4 py-8 flex shadow-md flex-col justify-between
          bg-[#faf8f8]
          ${isMobile && !collapsed ? 'absolute' : ''}
        `}
      >
        {/* Top Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <Link href="/blogs" className="flex-shrink-0 group font-medium text-3xl text-[#d66e6e]">
                {/* <img
                  src="/Images/logo.webp"
                  alt="Logo"
                  className="h-10 w-auto lg:h-12"
                /> */}
                Blogs
              </Link>
            )}
<button
  onClick={() => setCollapsed(!collapsed)}
  className="p-2 neumorphic-btn ml-auto lg:ml-0 rounded-lg hover:bg-gray-200"
>
  <Menu size={20} />
</button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.name}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setCollapsed(true)
                    }
                  }}
                  href={item.href}
                  className={`flex items-center gap-3 capitalize px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${
                      active
                        ? 'bg-[#f3f2f1] text-[#2d2d2d] shadow-sm'
                        : 'text-gray-600 hover:bg-[#f3f2f1] hover:text-black'
                    }
                  `}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div>
          <button
            onClick={() => setShowLogoutPopup(true)}
            className="cursor-pointer flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition"
          >
            <LogOut size={18} />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {showLogoutPopup && (
        <PopupModal
          title="Are you sure you want to logout?"
          onCancel={() => setShowLogoutPopup(false)}
          onConfirm={() => {
            // setShowLogoutPopup(false)
            logoutAdmin()
          }}
          confirmText="Logout"
          cancelText="Cancel"
          type="delete"
        />
      )}
    </div>
  )
}

export default Sidebar