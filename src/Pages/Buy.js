import React from "react";

import image from "../assets/mintbackground.jpg";
import image2 from "../assets/giphy.gif";
import { Card } from "../Components/Card";
import { deployaddress, contractABI } from "../Components/constants";
import { useState, useRef } from "react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import walletconnect from "../assets/walletconnect.png";
import { ethers } from "ethers";
import axios from "axios";

export const Buy = () => {
  const buttonRef = useRef(null);
  const status = useConnectionStatus();
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [allNFTsUpdated, setAllNFTsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchData = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();
      const contract = new ethers.Contract(deployaddress, contractABI, signer);
      try {
        if (contract !== null) {
          const allnft = await contract.getAllNFTs();

          const promises = allnft.map(async (item) => {
            const tokenuri = await contract.tokenURI(item.tokenId.toNumber());
            const response = await axios.get(tokenuri);
            const jsonData = response.data;
            jsonData.tokenId = item.tokenId.toString();

            return {
              tokenId: item.tokenId.toString(),
              name: jsonData.name,
              price: ethers.utils.formatEther(item.price),
              description: jsonData.description,
              image: `https://ipfs.io/ipfs/${jsonData.image}`,
              owner: item.owner,
              seller: item.seller,
            };
          });

          const jsonDataArray = await Promise.all(promises);

          if (!dataFetched) {
            try {
              updateData((prev) => [...prev, ...jsonDataArray]);
              updateFetched(true);
            } catch (err) {
              alert("No Properties Found");
            }
          }
          setAllNFTsUpdated(false);
        } else {
          alert("Connect to Metamask");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        setError(false);
      }
    }
  };
  const handleButtonClick = () => {
    try {
      fetchData();
      console.log(data);
    } catch (error) {
      alert("No Properties Found");
    }
  };
  if (!allNFTsUpdated) {
    fetchData();
    setAllNFTsUpdated(true);
  }

  return (
    <>
      <div
        className="bg-gradient-to-br from-purple-100 to-indigo-900 flex items-center justify-center py-2 pb-6"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <div className="flex flex-col items-center">
          {status === "undefined" ||
          status === "disconnected" ||
          status === "connecting" ? (
            <div className="flex flex-col items-center m-5 mt-6 ">
              <img
                src={walletconnect}
                alt="loading"
                className="w-60 h-60 object-cover rounded-full mb-4 transition-transform transform-gpu hover:scale-110"
              />
              <h1 className="text-3xl font-bold ">Connect Wallet </h1>
              <h1 className="text-3xl font-bold ">Use Mumbai Testnet </h1>
            </div>
          ) : (
            <div className="max-w-screen-xl mt-20 mx-auto px-4 flex justify-center items-center min-h-screen">
              {error ? (
                console.log(error)
              ) : (
                <div
                  className="flex flex-wrap justify-center gap-6"
                  style={{ paddingTop: "10px" }}
                >
                  {isLoading ? (
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
                    <>
                      <button
                        ref={buttonRef}
                        onClick={handleButtonClick}
                      ></button>
                      {data.map((item, key) => (
                        <Card
                          key={item.tokenId}
                          name={item.name}
                          price={item.price}
                          accountaddress={item.accountaddress}
                          image={item.image}
                          tokenId={item.tokenId}
                          owner={item.owner}
                          seller={item.seller}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
