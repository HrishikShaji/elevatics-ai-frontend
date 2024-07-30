import SearchBar from '@/components/SearchBar';
import SignInButton from '@/components/SignInButton';
import React from 'react';

const Page = () => {

    return <div className="relative flex flex-col px-10 gap-5 items-center h-full pt-[200px] sm:pt-[200px] w-full">
        <h1 className="text-3xl font-semibold">
            Quick Search
        </h1>
        <h1 className="text-[#8282AD] text-center">
            Efficiently Searches Everything.
        </h1>

        <SearchBar />
        <SignInButton />
    </div>;
};

export default Page;
