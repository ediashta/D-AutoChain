import React, {useEffect, useState} from 'react';
import axiosInstance from "../../api/axiosInstance.js";

const useFetchPartnership = (id) => {
    const [datas, setDatas] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [sortOrder, setSortOrder] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchPartnership = async () => {
        setIsLoading(true)
        try {
            const partnershipResponse = await axiosInstance.get(`/api/partnerships/${id}`,{
                params:{
                    sortOrder,
                    page: currentPage,
                    size: pageSize,
                    sortBy: "company",
                }
            })
            const {count,totalPages} = partnershipResponse.data.paging
            setTotalPages(totalPages)
            setDatas(partnershipResponse.data.data)
            setIsLoading(false)
        }catch (err){
            console.log(err.message)
        }
    }

    useEffect(() => {
        fetchPartnership()
    }, [currentPage,pageSize]);
    return{
        datas,
        isLoading,
        currentPage,
        pageSize,
        totalPages,
        handlePageChange,
    }
};

export default useFetchPartnership;