import { setSavedJobs } from "@/redux/jobSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetSavedJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/saved/get`, { withCredentials: true });
                console.log(res.data);
                if (res.data.success) {
                    dispatch(setSavedJobs(res.data.savedJobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSavedJobs();
    }, [dispatch])
};
export default useGetSavedJobs;
