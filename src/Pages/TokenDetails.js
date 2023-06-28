import React from "react";
import { useParams } from "react-router-dom";

import { deployaddress, contractABI } from "../Components/constants";
import image from "../assets/mintbackground.jpg";
import image2 from "../assets/giphy.gif";
import loading2 from "../assets/Loading2.gif";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import walletconnect from "../assets/walletconnect.png";
import { useConnectionStatus, useChain } from "@thirdweb-dev/react";
import { ethers } from "ethers";

export const TokenDetails = () => {
  const address = useAddress();
  const param = useParams();
  const status = useConnectionStatus();
  const chain = useChain();

  const [owner, setowner] = useState("");
  const [price, setprice] = useState("");
  const [tokenId, settokenId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [seller, setseller] = useState("");
  const [jsonData, updateJsonData] = useState({});
  const [newloading, setnewloading] = useState(false);
  const truncatedSeller = `${seller.slice(0, 6)}...${seller.slice(-6)}`;
  const truncatedOwner = `${owner.slice(0, 6)}...${owner.slice(-6)}`;

  const fetchdata = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          deployaddress,
          contractABI,
          signer
        );
        const data = await contract.getListedTokenForId(param.id);
        settokenId(data.tokenId.toNumber());

        const tokenuri = await contract.tokenURI(data.tokenId.toNumber());
        setowner(data.owner);
        setprice(data.price.toString());
        setseller(data.seller);
        const response = await axios.get(tokenuri);
        updateJsonData(response.data);
      }
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handlesale = async () => {
    setnewloading(true);
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          deployaddress,
          contractABI,
          signer
        );

        const tx = await contract.executeSale(tokenId, {
          value: price.toString(),
        });
        await tx.wait();
        alert("Transaction Successful");
      }
    } catch (err) {
      console.log(err);
      alert("Transaction Failed");
    } finally {
      setnewloading(false);
    }
  };
  useEffect(() => {
    fetchdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  try {
    return (
      <div
        className="flex flex-col justify-center items-center min-h-screen relative pattern-cross-dots-sm"
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
                className="w-48 h-48 object-cover rounded-full mb-4 transition-transform transform-gpu hover:scale-110"
              />
              <h1 className="text-3xl font-bold ">Connect Wallet </h1>
              <h1 className="text-3xl font-bold ">Use Mumbai Testnet </h1>
            </div>
          </div>
        ) : error ? (
          console.log(error)
        ) : isLoading ? (
          <div className="flex items-center justify-center m-5 mx-4 px-1 md:mx-16 rounded-lg transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 mb-8">
            <div className="flex flex-col items-center">
              <img
                src={image2}
                alt="loading"
                className="w-48 h-48 object-cover rounded-full mb-4"
              />
              <h1 className="text-xl md:text-3xl font-bold">Loading.......</h1>
            </div>
          </div>
        ) : (
          <section className="flex flex-col md:flex-row m-5 items-center mx-4 px-1 md:mx-16 rounded-lg p-8 transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 mb-8">
            <div>
              <img
                src={`https://ipfs.io/ipfs/${jsonData.image}`}
                alt="logo"
                className="max-w-xs h-auto rounded-lg shadow-lg hover:shadow-2xl shadow-cyan-400 transform hover:scale-105 transition-all duration-300"
              />
            </div>

            <div className="mt-4 md:mt-0 ml-0 md:ml-6 text-center md:text-left">
              <div className="mt-4 text-center md:text-left">
                <div className="inline-block bg-cyan-600 text-white px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-black hover:-translate-y-1 transition-all duration-300">
                  <p className="text-lg md:text-2xl font-bold">
                    NFT Name:{" "}
                    <span className="tw-animate-pulse tw-text-indigo-900 shadow-2xl shadow-black">
                      {jsonData.name}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 text-center md:text-left">
                <div className="inline-block bg-cyan-600 text-white px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-black hover:-translate-y-1 transition-all duration-300">
                  <p className="text-lg md:text-2xl font-bold">
                    NFT Price:{" "}
                    <span className="tw-animate-pulse tw-text-indigo-900 shadow-2xl bg-black rounded shadow-black">
                      {jsonData.price} {chain.nativeCurrency.symbol}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-4 text-center md:text-left">
                <div className="inline-block bg-cyan-600 text-white px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-black hover:-translate-y-1 transition-all duration-300">
                  <p className="text-lg md:text-2xl font-bold">
                    Owner:{" "}
                    <span className="tw-animate-pulse tw-text-indigo-900 shadow-2xl bg-black rounded shadow-black">
                      {truncatedOwner}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-4 text-center md:text-left">
                <div className="inline-block bg-cyan-600 text-white px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-black hover:-translate-y-1 transition-all duration-300">
                  <p className="text-lg md:text-2xl font-bold">
                    Seller:{" "}
                    <span className="tw-animate-pulse tw-text-indigo-900 shadow-2xl bg-black rounded shadow-black">
                      {truncatedSeller}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-4 text-center md:text-left">
                <div className="inline-block bg-cyan-600 text-white px-2 rounded-md shadow-md hover:shadow-2xl shadow-black hover:-translate-y-1 transition-all duration-300">
                  <p className="flex">
                    <span className="text-xl md:text-2xl font-bold text-indigo-900 mt-0">
                      NFT Description:
                    </span>
                    <span className="text-xl md:text-2xl font-bold text-indigo-900 mt-0">
                      {jsonData.description}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-4 text-center">
                {address === seller ? null : newloading ? (
                  <button type="button" className="btn btn-primary">
                    <div className="transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 rounded-full p-1">
                      <img
                        src={loading2}
                        alt="loading"
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    </div>
                  </button>
                ) : (
                  <button
                    className="btn btn-primary text-lg md:text-xl font-bold bg-gradient-to-r from-red-500 to-red-950 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-2xl backdrop-filter backdrop-blur-lg bg-opacity-30"
                    onClick={handlesale}
                  >
                    executeSale
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.log(error);
  }
};
