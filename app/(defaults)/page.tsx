import QuickSearchBar from '@/components/QuickSearchBar';
import SearchBar from '@/components/SearchBar';
import SettingsModal from '@/components/SettingsModal';
import SignInButton from '@/components/SignInButton';
import React from 'react';

const Page = () => {

    return <div className='relative rounded-3xl bg-white h-[90vh] flex justify-center items-center w-full '>
        <SearchBar />
        <SignInButton />
    </div>;
};

export default Page;
