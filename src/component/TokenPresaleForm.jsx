import React, { useState } from "react";


const TokenPresaleForm = () => {
  const [formData, setFormData] = useState({
    saleToken: "",
    salePrice: "",
    minimumBuy: "",
    softcap: "",
    lpLaunchPrice: "",
    maximumBuy: "",
    hardcap: "",
  });

  const [totalTokens, setTotalTokens] = useState(0);
  const [saleRate, setSaleRate] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Create Solana Token Presale</h1>
          <button className="text-teal-400 hover:text-teal-300">
            Token Launchpad Guide
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sale Token: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Connect your wallet please."
                  className="w-full bg-gray-800 rounded p-3 text-white"
                  name="saleToken"
                  value={formData.saleToken}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-400 mt-1">
                  I don't have a solana token
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Sale Price: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Put the price of your token on Presale"
                  className="w-full bg-gray-800 rounded p-3 text-white"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-400 mt-1">
                  How much SOL to pay per Token
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Minimum Buy (SOL): <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Put the Minimum amount of SOL to buy in this Phase"
                  className="w-full bg-gray-800 rounded p-3 text-white"
                  name="minimumBuy"
                  value={formData.minimumBuy}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-400 mt-1">
                  Minimum SOL quantity that user can buy
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Softcap (SOL): <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Put the softcap of the Presale"
                  className="w-full bg-gray-800 rounded p-3 text-white"
                  name="softcap"
                  value={formData.softcap}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-400 mt-1">
                  Minimum amount of SOL raised to consider sale successful
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Payment Currency: <span className="text-red-500">*</span>
                </label>
                <select className="w-full bg-gray-800 rounded p-3 text-white">
                  <option value="SOL">SOL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  LP Launch Price: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Put the price token price on the Liquidity Pool"
                  className="w-full bg-gray-800 rounded p-3 text-white"
                  name="lpLaunchPrice"
                  value={formData.lpLaunchPrice}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-400 mt-1">
                  How much SOL to pay per token on liquidity pool launch
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Maximum Buy (SOL): <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Put the Maximum amount of SOL to buy in this Phase"
                  className="w-full bg-gray-800 rounded p-3 text-white"
                  name="maximumBuy"
                  value={formData.maximumBuy}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-400 mt-1">
                  Maximum SOL quantity that user can buy
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Hardcap (SOL): <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Put the Hardcap of the Presale"
                  className="w-full bg-gray-800 rounded p-3 text-white"
                  name="hardcap"
                  value={formData.hardcap}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-400 mt-1">
                  Maximum amount of SOL that you can raise with the sale
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <div className="space-x-4">
              <span>Sending {totalTokens} Tokens</span>
              <span>Sale Rate: {saleRate} Tokens/SOL</span>
            </div>
            <div className="space-x-4">
              <span>Total Fees: 0.1 SOL</span>
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded"
              >
                Continue
              </button>
            </div>
          </div>
        </form>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Smithii takes a 2.5% fee
        </p>
      </div>
    </div>
  );
};

export default TokenPresaleForm;
