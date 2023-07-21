import React, { useEffect, useState } from "react";
import image from "../assets/mintbackground.jpg";
import walletconnect from "../assets/walletconnect.png";
import home3 from "../assets/Luffy6.gif";
import image2 from "../assets/giphy.gif";

import {
  useAddress,
  useContract,
  useConnectionStatus,
} from "@thirdweb-dev/react";
import { deployaddress } from "../Components/constants";
import { ethers } from "ethers";
export const Home = () => {
  const status = useConnectionStatus();

  const address = useAddress();
  const { contract } = useContract(deployaddress);
  const [balance, setbalance] = useState(null);
  const [caddress, setaddress] = useState(null);
  const [chainId, setchainId] = useState(null);
  const [name, setname] = useState(null);
  const [symbol, setsymbol] = useState(null);
  const [listprice, setlistprice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  let truncateCaddress;
  let truncateaddress;
  try {
    truncateCaddress = `${caddress.slice(0, 6)}...${caddress.slice(-6)}`;
    truncateaddress = `${address.slice(0, 6)}...${address.slice(-6)}`;
  } catch (err) {
    console.log(err);
  }

  const fetchdata = async () => {
    try {
      setaddress(contract.getAddress());

      setchainId(await contract._chainId.toString());
      setname(await contract.contractWrapper.readContract.name());

      const balance = await contract.contractWrapper.signer.getBalance();
      setbalance(ethers.utils.formatEther(balance).toString());

      setsymbol(await contract.contractWrapper.readContract.symbol());
      const price = await contract.contractWrapper.readContract.getListPrice();
      setlistprice(ethers.utils.formatEther(price).toString());
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  try {
    return (
      <div
        className="bg-gray-800 flex justify-center items-center"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        {status === "undefined " ||
        status === "disconnected" ||
        status === "disconnected" ||
        status === "connecting" ? (
          <div className="flex items-center justify-center m-5 mx-4 px-1 md:mx-16 rounded-lg transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 mb-8">
            <div className="flex flex-col items-center m-5">
              <img
                src={walletconnect}
                alt="loading"
                class="w-60 h-60 object-cover rounded-full mb-4 transition-transform transform-gpu hover:scale-110"
              />
              <h1 className="text-3xl font-bold ">Connect Wallet </h1>
              <h1 className="text-3xl font-bold ">Use Mumbai Testnet </h1>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center m-5 mx-4 px-1 md:mx-16 rounded-lg transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 mb-8">
            <div className="flex flex-col items-center">
              <img
                src={image2}
                alt="loading"
                className="w-60 h-60 object-cover rounded-full mb-4"
              />
              <h1 className="text-3xl font-bold">Loading.......</h1>
            </div>
          </div>
        ) : (
          <section
            className="flex flex-col md:flex-row m-5 items-center mx-4 px-1 md:mx-16 rounded-lg p-4 md:p-8 transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 mb-8"
            style={{ paddingTop: "100px" }}
          >
            <div className="md:mr-8">
              <img
                src={home3}
                alt="logo"
                className="max-w-full h-auto rounded-lg shadow-lg hover:shadow-2xl shadow-cyan-400 transform hover:scale-105 transition-all duration-300"
              />
            </div>

            <div className="mt-4 md:mt-0 text-center">
              <div className="mb-2 md:mb-4 text-center">
                <div className="inline-block bg-gray-950 text-white px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-black hover:-translate-y-1 transition-all duration-300 bg-opacity-25">
                  <p className="text-base md:text-2xl font-bold">
                    Deployer Address:
                    <span className="tw-animate-pulse tw-text-indigo-900 shadow-2xl bg-black rounded shadow-black bg-opacity-35">
                      <span className="whitespace-nowrap">
                        {truncateCaddress}
                      </span>
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-2 md:mb-4 text-center">
                <div className="inline-block bg-gray-950 text-white px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-black hover:-translate-y-1 transition-all duration-300 bg-opacity-25">
                  <p className="text-base md:text-2xl font-bold">
                    Wallet Address:
                    <span className="tw-animate-pulse tw-text-indigo-900 shadow-2xl bg-black rounded shadow-black bg-opacity-35">
                      <span className="whitespace-nowrap">
                        {truncateaddress}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
              <div className="mb-2 md:mb-4 text-center">
                <div className="inline-block bg-gray-950 text-white px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-black hover:-translate-y-1 transition-all duration-300 bg-opacity-25">
                  <p className="text-lg md:text-xl font-bold">
                    balance:
                    <span className="tw-animate-pulse tw-text-indigo-900 shadow-2xl bg-black rounded shadow-black bg-opacity-35">
                      {balance}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-2 md:mb-4 text-center">
                <div className="inline-block bg-gray-950 text-white px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-black hover:-translate-y-1 transition-all duration-300 bg-opacity-25">
                  <p className="text-lg md:text-2xl font-bold">
                    ChainId:
                    <span className="tw-animate-pulse tw-text-indigo-900 shadow-2xl bg-black rounded shadow-black bg-opacity-35">
                      {chainId}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mb-2 md:mb-4 text-center">
                <div className="inline-block bg-gray-950 text-white px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-black hover:-translate-y-1 transition-all duration-300 bg-opacity-25">
                  <p className="text-lg md:text-2xl font-bold">
                    Contract Name:
                    <span className="tw-animate-pulse tw-text-indigo-900 shadow-2xl bg-black rounded shadow-black bg-opacity-35">
                      {name}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mb-2 md:mb-4 text-center">
                <div className="inline-block bg-gray-950 text-white px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-black hover:-translate-y-1 transition-all duration-300 bg-opacity-25">
                  <p className="text-lg md:text-2xl font-bold">
                    Contract Symbol:
                    <span className="tw-animate-pulse tw-text-indigo-900 shadow-2xl bg-black rounded shadow-black bg-opacity-35">
                      {symbol}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mb-2 md:mb-4 text-center">
                <div className="inline-block bg-gray-950 text-white px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-black hover:-translate-y-1 transition-all duration-300 bg-opacity-25">
                  <p className="text-lg md:text-2xl font-bold">
                    Listing Price:
                    <span className="tw-animate-pulse tw-text-indigo-900 shadow-2xl bg-black rounded shadow-black bg-opacity-35">
                      {listprice}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    );
  } catch (err) {
    console.log(err);
  }
};
