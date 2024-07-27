import SearchBar from '@/components/SearchBar';
import SignInButton from '@/components/SignInButton';
import React from 'react';

const Page = () => {

    return <div className='  h-screen flex items-center pt-[300px] justify-center w-full '>
        <SearchBar />
        <SignInButton />
    </div>;
};

export default Page;
