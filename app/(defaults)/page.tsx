import QuickSearchBar from '@/components/QuickSearchBar';
import SearchBar from '@/components/SearchBar';
import SignInButton from '@/components/SignInButton';
import React from 'react';

const Page = () => {

    return <div className='relative h-[80vh] flex justify-center items-center w-full '>
        <SearchBar />
        <SignInButton />
    </div>;
};

export default Page;
