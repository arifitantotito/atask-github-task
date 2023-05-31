import axios from "axios";
import { useRef, useState } from "react";
import { AiFillStar, AiOutlineDown } from "react-icons/ai";

export default function Explorer() {
  let inputName = useRef();
  let [search, setSearch] = useState("");
  let [maxData, setMaxData] = useState(0);
  let [getName, setGetName] = useState([]);
  let [detail, setDetail] = useState([]);
  let [ind, setIdn] = useState(0);
  let [open, setOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  let onSearch = async () => {
    try {
      setLoading(true);
      let thisName = inputName.current.value;
      let response = await axios.get(
        `https://api.github.com/search/users?q=${thisName}`
      );
      let sliceData = response.data.items.slice(0, 5);
      setMaxData(sliceData.length);
      setGetName(sliceData);
      setSearch(thisName);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  let onRepo = async (name, index) => {
    try {
      let response = await axios.get(
        `https://api.github.com/users/${name}/repos`
      );
      setDetail(response.data);
      setIdn(index);
      setOpen(!open);
      console.log(response);
    } catch (error) {}
  };

  return (
    <>
      <div className="h-screen">
        <div className="flex flex-col justify-center items-center p-5">
          <div className="">
            <div className="mt-10 flex flex-col">
              <input
                ref={inputName}
                type="text"
                placeholder="Enter username"
                className="w-[500px] rounded-md"
              />
              <button
                onClick={() => {
                  onSearch();
                }}
                className="border mt-5 py-2 bg-sky-600 rounded-md font-semibold"
              >
                Search
              </button>
            </div>
            {search ? (
              <div className="flex justify-center mt-3 text-slate-600">
                Showing {maxData} users for "{search}"
              </div>
            ) : null}
          </div>
          {loading == true ? (
            <div>Loading...</div>
          ) : (
            <div className="mt-5 flex flex-col gap-1">
              {getName.map((value, index) => {
                return (
                  <div className="">
                    <button
                      onClick={() => {
                        onRepo(value.login, index);
                      }}
                      className="border w-[500px] bg-slate-300 rounded-md py-2"
                    >
                      <div className="flex justify-between p-5">
                        <div className="font-bold">{value.login}</div>
                        <div>
                          <AiOutlineDown
                            className={`${
                              open === true && index === ind ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                    {open === true && index === ind
                      ? detail.map((val, idx) => {
                          return (
                            <div className="border w-[500px] mt-2" key={val.id}>
                              <button className="flex justify-between gap-3 w-full bg-slate-400">
                                <div className="flex flex-col gap-2 p-3">
                                  <div className="flex gap-2">
                                    <div className="font-bold">{val.name}</div>
                                  </div>
                                  {val.description ? (
                                    <div className="flex justify-start font-medium text-justify">
                                      {val.description}
                                    </div>
                                  ) : (
                                    <div className="flex justify-start font-medium">
                                      No Description
                                    </div>
                                  )}
                                </div>
                                <div className="flex mt-3 justify-end p-3">
                                  {val.stargazers_count}{" "}
                                  <AiFillStar size={25} />
                                </div>
                              </button>
                            </div>
                          );
                        })
                      : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
