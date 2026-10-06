type SchoolHeaderProps = {
  term: string
  session: string
}

export function SchoolHeader({ term, session }: SchoolHeaderProps) {
  return (
    <div className="mb-4 border border-black">
      <div className="grid grid-cols-12">
        <div className="col-span-2 border-r border-black flex items-center justify-center p-2">
          <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="School Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>

        <div className="col-span-10 text-center py-3 px-4">
          <h1 className="text-xl md:text-2xl font-extrabold uppercase tracking-wide text-[#1B5E20]">
            Gifted Scholars Academy & Islamiyyah
          </h1>

          <p className="text-xs text-black mt-0.5">
            No. 11, Lom Street, Jikwoyi, Phase 1 Extension, Abuja, FCT.
          </p>

          <p className="text-xs text-black">
            Tel: 0803 678 9826, 0806 842 1860 &nbsp;|&nbsp; Email: giftedscholarsandislamiyyah@gmail.com
          </p>

          <p className="text-xs italic text-[#D97706] mt-0.5 font-medium">
            Motto: Knowledge, Discipline & Excellence
          </p>
          <div className="mt-2 border-t border-black pt-2">
            <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-black">
              {term} Examination Result
            </h2>

            <p className="text-xs font-medium text-black">{session} Academic Session</p>
          </div>
        </div>
      </div>
    </div>
  );
}