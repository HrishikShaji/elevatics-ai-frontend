import SearchBar from "./components/SearchBar";

export default function Page() {
    return (<div className="relative flex flex-col px-10 gap-5 items-center h-full pt-[200px] sm:pt-[200px] w-full">
        <h1 className="text-3xl font-semibold">
            iResearcher
        </h1>
        <h1 className="text-[#8282AD] text-center">
            Everything from Internet.
        </h1><SearchBar /></div>)
}
