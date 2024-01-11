import IconView from "../../../../assets/icons/Icon View.svg";
import IconSearch from "../../../../assets/icons/Icon Search.svg";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined.js";
import { ChevronLeftOutlined } from "@mui/icons-material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined.js";
import { Link, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Badge from "../../../../components/Badge";
import { useDispatch, useSelector } from "react-redux";
import { ServiceContext } from "../../../../context/ServiceContext.jsx";
import { useFormik } from "formik";
import { financingAction } from "../../../../slices/financingSlice.js";
import { formatDate, toTitleCase } from "../../../../utils/utility.js";

const FinancingList = () => {
  const [searchParam, setSearchParam] = useSearchParams();

  const dispatch = useDispatch();
  const { financings } = useSelector((state) => state.financing);
  const { financingService } = useContext(ServiceContext);
  const [paging, setPaging] = useState({});

  console.log(financings);

  const currentPage = parseInt(searchParam.get("page") || 1);
  const currentSize = parseInt(searchParam.get("size") || 10);

  const onNext = (page) => {
    if (page === paging.totalPages) return;
    searchParam.set("page", page + 1);
    setSearchParam(searchParam);
  };

  const onPrevious = (page) => {
    if (page === 1) return;
    searchParam.set("page", page - 1);
    setSearchParam(searchParam);
  };

  const formik = useFormik({
    initialValues: {
      type: "payable",
      status: null,
    },
    onSubmit: (values) => {
      console.log(values);
      dispatch(
        financingAction(async () => {
          const result = await financingService.fetchFinancingBo({
            page: currentPage,
            size: currentSize,
            direction: "asc",
            type: values.type,
            status: values.status,
          });
          console.log(result, "--------");
          if (result) {
            setPaging(result.paging);
            const data = result.data;
            console.log(data);
            return { data };
          }
        })
      );
    },
  });

  useEffect(() => {
    const onGetFinancing = () => {
      try {
        dispatch(
          financingAction(async () => {
            const result = await financingService.fetchFinancingBo({
              page: currentPage,
              size: currentSize,
              direction: "asc",
              type: "payable",
              status: null,
            });
            console.log(result);
            if (result) {
              setPaging(result.paging);
              const data = result.data;
              return { data };
            }
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    onGetFinancing();
  }, [dispatch, financingService, currentPage, currentSize]);

  useEffect(() => {
    if (currentPage < 1 || currentPage > paging.totalPages) {
      const newSearchParam = new URLSearchParams(searchParam);
      newSearchParam.set("page", 1);
      setSearchParam(newSearchParam.toString());
    }
  }, [currentPage, paging.totalPages, searchParam, setSearchParam]);

  const [searchTerm, setSearchTerm] = useState("");
  const data = financings;
  console.log(data);
  const filterFinancing = searchTerm
    ? data.filter((item) =>
        item.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    console.log(isChecked);
    let checked = "";
    if (!isChecked) {
      formik.setValues({
        type: "receivable",
      });
      checked = "receivable";
    } else {
      formik.setValues({
        type: "payable",
      });
      checked = "payable";
    }
    console.log(checked);

    dispatch(
      financingAction(async () => {
        const result = await financingService.fetchFinancingBo({
          page: currentPage,
          size: currentSize,
          direction: "asc",
          type: checked,
          status: null,
        });
        console.log(result);
        if (result) {
          setPaging(result.paging);
          const data = result.data;
          return { data };
        }
      })
    );
  };

  return (
    <>
      <div className="relative flex justify-between mb-6 mx-4">
        <h1 className="text-title my-auto">Financing</h1>
        <div>
          <label className="themeSwitcherTwo shadow-card border border-[#D5D5D7] relative inline-flex cursor-pointer select-none items-center justify-center rounded-xl bg-[#F3F4F6] p-1">
            <input
              type="checkbox"
              className="sr-only"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <span
              className={`flex items-center space-x-[6px] rounded-xl py-2 px-3 text-sm font-medium ${
                !isChecked ? "text-white bg-orange" : "text-orange"
              }`}
            >
              Account Payable
            </span>
            <span
              className={`flex items-center space-x-[6px] rounded-xl py-2 px-3 text-sm font-medium ${
                isChecked ? "text-white bg-orange" : "text-orange"
              }`}
            >
              Account Receivable
            </span>
          </label>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="relative flex justify-between mb-5 gap-4 mx-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex items-center py-2">
              <input
                className="border-none bg-orange bg-opacity-10 rounded-l-lg w-72 h-11 placeholder:opacity-50 pl-12 "
                id="email"
                type="text"
                placeholder="Search..."
                onChange={handleSearch}
                value={searchTerm}
              />
              <img
                src={IconSearch}
                className="absolute ml-5"
                alt="Search Icon"
              />
              <button
                className="bg-orange text-white rounded-r-lg focus:outline-none focus:shadow-outline w-24 h-11 disabled:bg-opacity-70"
                type="submit"
              >
                Search
              </button>
            </div>
          </form>
          <div className="flex items-center space-x-4">
            <p className="mt-3">Filter By:</p>
            <button
              id="dropdownDefaultButton"
              data-dropdown-toggle="dropdown"
              className="text-orange bg-white border border-orange hover:bg-orange hover:text-white font-medium rounded-lg text-sm px-3 py-1 text-center mt-3"
              type="button"
            >
              <ExpandMoreOutlinedIcon className="my-auto" />
            </button>
          </div>
          <div
            id="dropdown"
            className="z-20 hidden bg-white divide-y border border-orange divide-gray-100 rounded-lg shadow w-80"
          >
            <form onSubmit={formik.handleSubmit}>
              <div className="">
                <ul
                  className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200 ml-10"
                  aria-labelledby="dropdownRadioButton"
                >
                  Status
                  <li>
                    <div className="flex items-center mt-3">
                      <input
                        type="radio"
                        name="status"
                        value={null}
                        checked={formik.values.status === null}
                        onChange={() => formik.setFieldValue("status", null)}
                        className="w-4 h-4 text-orange bg-gray-100 border-gray-300 focus:ring-orange"
                      />
                      <label
                        htmlFor="default-radio-1"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        All
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        value="PENDING"
                        name="status"
                        checked={formik.values.status === "PENDING"}
                        onChange={formik.handleChange}
                        className="w-4 h-4 text-orange bg-gray-100 border-gray-300 focus:ring-orange"
                      />
                      <label
                        htmlFor="default-radio-2"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Pending
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        value="REJECTED"
                        name="status"
                        checked={formik.values.status === "REJECTED"}
                        onChange={formik.handleChange}
                        className="w-4 h-4 text-orange bg-gray-100 border-gray-300 focus:ring-orange"
                      />
                      <label
                        htmlFor="default-radio-2"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Rejected
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        value="ONGOING"
                        name="status"
                        checked={formik.values.status === "ONGOING"}
                        onChange={formik.handleChange}
                        className="w-4 h-4 text-orange bg-gray-100 border-gray-300 focus:ring-orange"
                      />
                      <label
                        htmlFor="default-radio-2"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        On-Going
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        value="OUTSTANDING"
                        name="status"
                        checked={formik.values.status === "OUTSTANDING"}
                        onChange={formik.handleChange}
                        className="w-4 h-4 text-orange bg-gray-100 border-gray-300 focus:ring-orange"
                      />
                      <label
                        htmlFor="default-radio-2"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Outstanding
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        value="COMPLETED"
                        name="status"
                        checked={formik.values.status === "COMPLETED"}
                        onChange={formik.handleChange}
                        className="w-4 h-4 text-orange bg-gray-100 border-gray-300 focus:ring-orange"
                      />
                      <label
                        htmlFor="default-radio-2"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Completed
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex space-x-5 justify-end mr-4 mb-4 mt-4">
                <button
                  type="button"
                  className="bg-gray/20 hover:bg-gray/20 text-zinc-800 py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange hover:bg-orange text-white py-2 px-4 rounded"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="relative overflow-x-auto mx-4 sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right mb-2">
            <thead className="text-white text-[16px] font-[300] bg-orange ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Inv. Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Company
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filterFinancing && filterFinancing?.length !== 0 ? (
                filterFinancing.map((i, idx) => {
                  return (
                    <tr key={idx} className="bg-white">
                      <th
                        scope="col-span-4"
                        className="px-6 py-4 font-normal text-graylight whitespace-nowrap text-[14px]"
                      >
                        {formatDate(i.date)}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 font-normal text-graylight whitespace-nowrap text-[14px]"
                      >
                        {i.invoice_number}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 font-normal text-orange whitespace-nowrap text-[14px]"
                      >
                        {i.amount}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 font-normal text-graylight whitespace-nowrap text-[14px]"
                      >
                        {i.company_name}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 font-normal text-graylight whitespace-nowrap text-[14px]"
                      >
                        <Badge variant={toTitleCase(i.status)}>
                          {toTitleCase(i.status)}
                        </Badge>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 font-normal text-graylight whitespace-nowrap text-[14px] flex space-x-3"
                      >
                        <Link to={`/backoffice/financing/detail/receivable/${i.financing_id}`}>
                          <button className="ml-4">
                            <img src={IconView} alt="Icon View" />
                          </button>
                        </Link>
                      </th>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    Company Not Found...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="relative flex justify-between px-6 mb-4 text-[12px] text-graylight/10">
          <p className="my-auto">
            Showing {paging.page} to {paging.size} of {paging.count} entries
          </p>

          <nav aria-label="Page navigation example">
            <ul className="flex items-center -space-x-px h-8 text-sm gap-4">
              <li className={`${currentPage == 1 && "disabled"}`}>
                <button
                  onClick={() => onPrevious(currentPage)}
                  className="flex items-center justify-center px-1 h-8 ms-0 leading-tight text-gray-500 bg-gray/20 rounded-s-lg hover:bg-orange/20 hover:text-orange"
                >
                  <ChevronLeftOutlined />
                  <span className="sr-only">Previous</span>
                </button>
              </li>
              {Array(paging.totalPages)
                .fill(null)
                .map((_, idx) => {
                  const page = ++idx;
                  return (
                    <li key={page}>
                      <Link
                        className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-200 bg-gray/20 rounded-md hover:bg-orange/20 hover:text-orange page-link ${
                          currentPage == page &&
                          "bg-gray/20 text-orange font-bold"
                        }`}
                        to={`/user/invoice?page=${page}&size=${currentSize}`}
                      >
                        {page}
                      </Link>
                    </li>
                  );
                })}
              <li
                className={`${currentPage >= paging.totalPages && "disabled"}`}
              >
                <button
                  onClick={() => onNext(currentPage)}
                  className="flex items-center justify-center px-1 h-8 leading-tight text-gray bg-gray/20 rounded-e-lg hover:bg-orange/20 hover:text-orange "
                >
                  <ChevronRightOutlinedIcon />
                  <span className="sr-only">Next</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default FinancingList;
