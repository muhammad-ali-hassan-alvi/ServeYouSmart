import React from 'react';
import ContactMessageDetails from '../../components/ContactMessagesTable';
import Navbar from '../../components/Navbar';

const Page = () => {
  return (
    <>
      <div className="mb-16">
        <Navbar />
      </div>
      <ContactMessageDetails />
    </>
  );
};

export default Page;
