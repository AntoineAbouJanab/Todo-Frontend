
export default function Header(){
return(
 <header className="fixed top-0 w-full h- sm:h-20  flex justify-between items-center px-2 sm:px-4 py-4 border-b border-gray-700 bg-dark-grey text-white ">
  {/* Left Side */}
  <div>
    <h1 className=" text-xs sm:text-lg font-bold">TO DO APP</h1>
    <p className="text-xxs sm:text-xs text-gray-400">Stop Procrastinating , Start Organizing</p>
  </div>

  {/* Right Side */}
  <div className="flex items-center gap-4">
    {/* Toggle Icon (can be a real button later) */}
    <button onClick={() => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }} className="w-3 h-3 sm:w-6 sm:h-6 rounded-full border border-white flex items-center justify-center absolute sm:right-12 right-10">
      <div className="w-2 h-2 bg-white rounded-full" />
    </button>

    {/* User Icon */}
    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-600 flex  items-center justify-center absolute right-2 ">
      <span className="text-white text-sm">👤</span>
    </div>
  </div>
</header>
);
}