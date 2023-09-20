import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

function Modals({
  isSuccessModalOpen,
  setIsSuccessModalOpen,
  isErrorModalOpen,
  setIsErrorModalOpen,
  finalTo,
  finalAmount,
}: {
  isSuccessModalOpen: any;
  setIsSuccessModalOpen: any;
  isErrorModalOpen: any;
  setIsErrorModalOpen: any;
  finalTo: any;
  finalAmount: any;
}) {
  function closeSuccessModal() {
    setIsSuccessModalOpen(false);
  }

  function closeErrorModal() {
    setIsErrorModalOpen(false);
  }
  return (
    <>
      <Transition show={isSuccessModalOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeSuccessModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[1px] transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-slate-700 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
                  <div>
                    <div className='mx-auto flex h-12 w-12 text-5xl items-center justify-center rounded-full bg-trasparent'>
                      🎉
                    </div>
                    <div className='mt-6 text-center sm:mt-5'>
                      <Dialog.Title
                        as='h3'
                        className=' font-bold leading-6 text-slate-50 text-xl text-center'
                      >
                        {`Congratulations!`}
                      </Dialog.Title>
                      <Dialog.Title
                        as='h3'
                        className=' font-bold leading-6 text-slate-50 text-xl text-center'
                      >
                        {`Tokens Sent Successfully`}
                      </Dialog.Title>
                      <Dialog.Title
                        as='h3'
                        className='font-bold leading-6 text-flarelink text-xl text-center break-words'
                      >
                        Your {finalAmount} Flare has been successfully sent to{' '}
                        {finalTo}.
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className='mt-5 sm:mt-6 flex justify-center items-center w-full'>
                    <button
                      onClick={closeSuccessModal}
                      className=' rounded-md bg-flarelink px-3 py-2 text-sm font-semibold shadow-sm text-justify text-white leading-tight'
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition show={isErrorModalOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeErrorModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[1px] transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-slate-700 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
                  <div>
                    <div className='mx-auto flex h-12 w-12 text-5xl items-center justify-center rounded-full bg-trasparent'>
                      🚨
                    </div>
                    <div className='mt-6 text-center sm:mt-5'>
                      <Dialog.Title
                        as='h3'
                        className=' font-bold leading-6 text-slate-50 text-xl text-center'
                      >
                        {`Oops, something went wrong...`}
                      </Dialog.Title>
                      <Dialog.Title
                        as='h3'
                        className='font-bold leading-6 text-slate-50 text-xl text-center break-words'
                      >
                        Your attempt to send {finalAmount} Flare to {finalTo}{' '}
                        failed.
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className='mt-5 sm:mt-6 flex justify-center items-center w-full'>
                    <button
                      onClick={closeErrorModal}
                      className=' rounded-md bg-flarelink px-3 py-2 text-sm font-semibold shadow-sm text-justify text-white leading-tight'
                    >
                      Try Again
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default Modals;
