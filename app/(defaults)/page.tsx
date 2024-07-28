import SearchBar from '@/components/SearchBar';
import SignInButton from '@/components/SignInButton';
import React from 'react';

const Page = () => {

    return <div className='  h-screen flex flex-col items-center w-full '>
        <div className='h-[300px] w-full'></div>
        <SearchBar />
        <SignInButton />
    </div>;
};

export default Page;
