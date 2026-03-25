const bgtest = () => {
    return (    
       <div className="relative min-h-screen overflow-hidden">

  {/* image */}
  <div className="absolute inset-0">
   <img
  src="../../src/assets/img/bg.jpg"
  className="w-full h-full object-cover"
/>
  </div>

  {/* gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-transparent" />

  {/* blur light */}
  <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-300/30 rounded-full blur-3xl" />

  {/* content */}
  <div className="relative z-10">
    <h1>Landing</h1>
  </div>

</div>
    )
}

export default bgtest;