import React from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useSelector } from 'react-redux';
import useGetSavedJobs from '@/hooks/useGetSavedJobs';

const SavedJobs = () => {
    useGetSavedJobs();
    const { savedJobs } = useSelector(store => store.job);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Saved Jobs ({savedJobs?.length || 0})</h1>
                {
                    savedJobs && savedJobs.length > 0 ? (
                        <div className='grid grid-cols-3 gap-4'>
                            {
                                savedJobs.map((job) => (
                                    <Job key={job?._id} job={job} />
                                ))
                            }
                        </div>
                    ) : (
                        <div className='text-center text-gray-500 py-10'>
                            <p className='text-lg'>You haven't saved any jobs yet.</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default SavedJobs
