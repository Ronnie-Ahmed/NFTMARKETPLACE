import React from "react";
import { useChain } from "@thirdweb-dev/react";
import { Link } from "react-router-dom";

export const Card = ({
  image,
  tokenId,
  name,
  price,
  description,
  owner,
  seller,
}) => {
  const chain = useChain();
  const truncatedSeller = `${seller.slice(0, 6)}...${seller.slice(-6)}`;

  return (
    <div>
      <Link to={`/buy/${tokenId}`}>
        <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-2xl shadow-cyan-700">
          <div className="transition duration-300 ease-in-out transform hover:scale-105">
            <img
              src={image}
              alt="Card Background"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-black bg-opacity-50">
            <div className="p-4 text-white">
              <h2 className="text-2xl font-bold mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
                Price: {price} {chain.nativeCurrency.symbol}
              </h2>
              <p className="text-lg overflow-hidden overflow-ellipsis whitespace-nowrap">
                seller: {truncatedSeller}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
