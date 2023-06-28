import React from "react";
import {
  useAddress,
  useContract,
  useConnectionStatus,
} from "@thirdweb-dev/react";
import { deployaddress } from "../Components/constants";
import image from "../assets/background2.jpg";
import image3 from "../assets/background1.jpg";
import image2 from "../assets/mintbackground.jpg";
import loading2 from "../assets/Loading2.gif";
import loading3 from "../assets/loading.gif";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import walletconnect from "../assets/walletconnect.png";

import { useEffect } from "react";
import { useState } from "react";

import nfticon from "../assets/NFT_Icon.png";

const projectId = "2NUvwy5K9EzmrmotQqVH303hmvV";
const projectSecret = "645df3033ab65599cf00069126867730";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export const Sell = () => {
  const walletaddress = useAddress();
  const [isLoading, setIsLoading] = useState(false);
  const { contract } = useContract(deployaddress);
  const status = useConnectionStatus();
  const [active, setActive] = useState(true);

  const [formdata, setformdata] = useState({
    name: "",
    description: "",
    price: "",
    accountaddress: walletaddress,
  });

  const [imgurl, setimgurl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, description, price, accountaddress } = formdata;

    const buffer = await imgurl.arrayBuffer();
    const { cid } = await ipfs.add(buffer);
    const info = {
      name: name,
      description: description,
      price: price,
      address: accountaddress,
      image: cid.toString(),
    };
    const result = await ipfs.add({
      path: cid.toString(),
      content: Buffer.from(JSON.stringify(info)),
    });
    console.log(`${result.cid.toString()}`);
    const list = await contract.call("getListPrice");
    console.log(price.toString());

    try {
      const data = await contract.call(
        "createToken",
        [`https://ipfs.io/ipfs/${result.cid.toString()}`, price.toString()],
        { value: list.toString() }
      );
      console.info("contract call successs", data);
      alert("NFT Minted Successfully");
    } catch (err) {
      console.error("contract call failure", err);
    } finally {
      setIsLoading(false); // Set isLoading back to false when the contract call is completed
    }
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setActive(false);
      } else {
        setActive(true);
      }
    };
    try {
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      {status === "undefined " ||
      status === "disconnected" ||
      status === "disconnected" ||
      status === "connecting" ? (
        <div
          className="bg-gradient-to-br  from-purple-100 to-indigo-900 flex items-center justify-center"
          style={{
            backgroundImage: `url(${image2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
          }}
        >
          <div className="flex items-center justify-center m-5 mx-4 px-1 md:mx-16 rounded-lg transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 mb-8">
            <div className="flex flex-col items-center">
              <img
                src={walletconnect}
                alt="loading"
                className="w-60 h-60 object-cover rounded-full mb-4 transition-transform transform-gpu hover:scale-110"
              />
              <h1 className="text-3xl font-bold ">Connect Wallet </h1>
              <h1 className="text-3xl font-bold ">Use Mumbai Testnet </h1>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="bg-gradient-to-br mt-2 from-purple-100 to-indigo-900  pb-6 flex space-between"
          style={{
            backgroundImage: `url(${image2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
          }}
        >
          {active ? (
            <section className="flex flex-col rounded-lg justify-center items-center min-h-screen bg-red relative pattern-cross-dots-sm p-3">
              <div className="flex flex-col items-center my-4">
                <div className="max-w-lg">
                  {isLoading ? (
                    <div className="flex justify-center ml-20 pl-20">
                      <div className="transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 rounded-full p-1">
                        <img
                          src={loading3}
                          alt="loading"
                          className="w-40 h-40 object-cover rounded-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <img
                      className="rounded-lg transform shadow-2xl shadow-cyan-900 hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
                      src={image3}
                      alt="404 Page Not Found"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-center my-4"></div>
            </section>
          ) : null}

          <div className="max-w-md mx-auto mt-20 p-3 transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 mb-8">
            <form onSubmit={handleSubmit} className="p-8">
              <img
                src={nfticon}
                alt="logo"
                className="w-full h-48 object-center object-cover my-7 mt-16"
              />
              <div>
                <label
                  htmlFor="account"
                  className="block text-gray-950 font-bold mb-2"
                >
                  NFT NAME
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={(e) =>
                    setformdata({ ...formdata, name: e.target.value })
                  }
                  placeholder="Give your NFT NAME"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-cyan-950"
                  required
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="amount"
                  className="block text-gray-950 font-bold mb-2"
                >
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.0000001"
                  onChange={(e) =>
                    setformdata({ ...formdata, price: e.target.value })
                  }
                  placeholder="NFT Price in ETH"
                  className="shadow appearance-none border bg-cyan-950 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="amount"
                  className="block text-gray-950 font-bold mb-2"
                >
                  Address of the Lister
                </label>
                <input
                  type="text"
                  name="accountaddress"
                  onChange={(e) =>
                    setformdata({ ...formdata, accountaddress: e.target.value })
                  }
                  placeholder={
                    formdata.accountaddress
                      ? formdata.accountaddress
                      : "No wallet connected"
                  }
                  className="shadow appearance-none border  bg-cyan-950 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="amount"
                  className="block text-gray-950 font-bold mb-2"
                >
                  Description
                </label>
                <textarea
                  type="string"
                  name="description"
                  value={formdata.description}
                  onChange={(e) =>
                    setformdata({ ...formdata, description: e.target.value })
                  }
                  className="shadow appearance-none border bg-cyan-950 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="amount"
                  className="block text-gray-950 font-bold mb-2"
                >
                  Choose an Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="shadow appearance-none border bg-cyan-950 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => {
                    setimgurl(e.target.files[0]);
                  }}
                  required
                />
              </div>
              <div className="flex justify-center mt-8">
                {isLoading ? (
                  <button type="button" className="btn btn-primary">
                    <div className="transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 rounded-full p-1">
                      <img
                        src={loading2}
                        alt="loading"
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    </div>
                  </button>
                ) : walletaddress ? (
                  <button
                    type="submit"
                    className="btn btn-primary text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-2xl backdrop-filter backdrop-blur-lg bg-opacity-30"
                  >
                    Mint NFT
                  </button>
                ) : (
                  <p className="btn btn-primary text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-2xl backdrop-filter backdrop-blur-lg bg-opacity-30">
                    CONNECT WALLET FIRST
                  </p>
                )}
              </div>
            </form>
          </div>
          {active ? (
            <section className="flex flex-col justify-center p-3 items-center min-h-screen bg-red relative pattern-cross-dots-sm">
              <div className="flex flex-col items-center my-4">
                <div className="max-w-lg">
                  {isLoading ? (
                    <div className="flex justify-center mr-20 pr-20 ">
                      <div className="transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 rounded-full p-1">
                        <img
                          src={loading3}
                          alt="loading"
                          className="w-40 h-40 object-cover rounded-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <img
                      className="rounded-lg transform shadow-2xl shadow-cyan-900 hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
                      src={image}
                      alt="404 Page Not Found"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-center my-4"></div>
            </section>
          ) : null}
        </div>
      )}
    </>
  );
};
