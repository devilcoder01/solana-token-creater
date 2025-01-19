import React, { useState } from "react";
import { Upload } from "lucide-react";
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  getMint,
  getMetadataPointerState,
  getTokenMetadata,
  TYPE_SIZE,
  LENGTH_SIZE,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  createRemoveKeyInstruction,
  pack,
} from "@solana/spl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const TokenCreator = () => {
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    decimals: "6",
    supply: "10",
    description: "",
    website: "",
    twitter: "",
    telegram: "",
    discord: "",
    creatorName: "Subha",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [addSocialLinks, setAddSocialLinks] = useState(false);
  const [modifyCreator, setModifyCreator] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { connection } = useConnection();
  const wallet = useWallet();

  async function createToken() {
    const mintKeypair = Keypair.generate();

    const mintAddr = mintKeypair.publicKey;

    const decimals = formData["decimals"];
    // Authority that can mint new tokens
    const mintAuthority = wallet.publicKey;
    // Authority that can update the metadata pointer and token metadata
    const updateAuthority = wallet.publicKey;

    // Token MetaData
    const metaData = {
      updateAuthority: updateAuthority,
      mint: mintAddr,
      name: formData["name"],
      symbol: formData["symbol"],
      uri: "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
      additionalMetadata: [["description", "Only Possible On Solana"]],
    };

    const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
    // Size of metadata
    const metadataLen = pack(metaData).length;

    // Size of Mint Account with extension
    const mintLen = getMintLen([ExtensionType.MetadataPointer]);

    // Minimum lamports required for Mint Account
    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataExtension + metadataLen
    );

    // <<===================================================================================>>>>>>>> //
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: wallet.publicKey, // Account that will transfer lamports to created account
      newAccountPubkey: mintAddr, // Address of the account to create
      space: mintLen, // Amount of bytes to allocate to the created account
      lamports, // Amount of lamports transferred to created account
      programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
    });

    const initializeMetadataPointerInstruction =
      createInitializeMetadataPointerInstruction(
        mintAddr, // Mint Account address
        updateAuthority, // Authority that can set the metadata address
        wallet.publicKey, // Account address that holds the metadata
        TOKEN_2022_PROGRAM_ID
      );

    // Instruction to initialize Mint Account data
    const initializeMintInstruction = createInitializeMintInstruction(
      mintAddr, // Mint Account Address
      decimals, // Decimals of Mint
      mintAuthority, // Designated Mint Authority
      null, // Optional Freeze Authority
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );

    // Instruction to initialize Metadata Account data
    const initializeMetadataInstruction = createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mintAddr, // Account address that holds the metadata
      updateAuthority: updateAuthority, // Authority that can update the metadata
      mint: mintAddr, // Mint Account address
      mintAuthority: mintAuthority, // Designated Mint Authority
      name: metaData.name,
      symbol: metaData.symbol,
      uri: metaData.uri,
    });

    // Instruction to update metadata, adding custom field
    const updateFieldInstruction = createUpdateFieldInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mintAddr, // Account address that holds the metadata
      updateAuthority: updateAuthority, // Authority that can update the metadata
      field: metaData.additionalMetadata[0][0], // key
      value: metaData.additionalMetadata[0][1], // value
    });
    // <<===================================================================================>>>>>>>> //

    const transaction = new Transaction().add(
      createAccountInstruction,
      initializeMetadataPointerInstruction,
      // The above instruction is required
      initializeMintInstruction,
      initializeMetadataInstruction,
      updateFieldInstruction
    );

    transaction.feePayer = wallet.publicKey; // The address that pay the fee
    await wallet.sendTransaction(transaction, connection);
    console.log(`Token mint created at ${mintkeypair.publicKey.toBase58()}`);
    const mintInfo = await getMint(
      connection,
      mintAddr,
      "confirmed",
      TOKEN_2022_PROGRAM_ID
    );

    const metadataPointer = getMetadataPointerState(mintInfo);
    console.log(
      "\nMetadata Pointer:",
      JSON.stringify(metadataPointer, null, 2)
    );

    // Retrieve and log the metadata state
    const metadata = await getTokenMetadata(
      connection,
      mintAddr // Mint Account address
    );
    console.log("\nMetadata:", JSON.stringify(metadata, null, 2));
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Solana Token Creator</h1>
          <p className="text-gray-400">
            Easily Create your own Solana SPL Token in just few steps without
            Coding.
          </p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <label className="block mb-1">
                Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Put the name of your Token"
                className="w-full bg-gray-800 rounded p-3 text-white"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block mb-1">
                Symbol: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="symbol"
                placeholder="Put the symbol of your Token"
                className="w-full bg-gray-800 rounded p-3 text-white"
                value={formData.symbol}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block mb-1">
                Decimals: <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="decimals"
                placeholder="6"
                className="w-full bg-gray-800 rounded p-3 text-white"
                value={formData.decimals}
                onChange={handleInputChange}
              />
              <p className="text-sm text-gray-400 mt-1">
                Most meme coin use 6 decimals
              </p>
            </div>

            <div>
              <label className="block mb-1">
                Supply: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="supply"
                placeholder="1"
                className="w-full bg-gray-800 rounded p-3 text-white"
                value={formData.supply}
                onChange={handleInputChange}
              />
              <p className="text-sm text-gray-400 mt-1">
                Most meme coin use 1GB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">
                Image: <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-gray-400">Upload Image</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Most meme coin use a squared 1000x1000 logo
              </p>
            </div>

            <div>
              <label className="block mb-1">
                Description: <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Put the description of your Token"
                className="w-full bg-gray-800 rounded p-3 text-white h-32"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-sm">
              Add Social Links & Tags
              <div className="relative inline-block w-12 h-6 ml-2">
                <input
                  type="checkbox"
                  className="opacity-0 w-0 h-0"
                  checked={addSocialLinks}
                  onChange={() => setAddSocialLinks(!addSocialLinks)}
                />
                <span
                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                    addSocialLinks ? "bg-teal-600" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute h-4 w-4 bg-white rounded-full transition-all duration-300 ${
                      addSocialLinks ? "left-7" : "left-1"
                    } top-1`}
                  ></span>
                </span>
              </div>
            </label>
          </div>

          {addSocialLinks && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                name="website"
                placeholder="Put your website"
                className="w-full bg-gray-800 rounded p-3 text-white"
                value={formData.website}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="twitter"
                placeholder="Put your twitter"
                className="w-full bg-gray-800 rounded p-3 text-white"
                value={formData.twitter}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="telegram"
                placeholder="Put your telegram"
                className="w-full bg-gray-800 rounded p-3 text-white"
                value={formData.telegram}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="discord"
                placeholder="Put your discord"
                className="w-full bg-gray-800 rounded p-3 text-white"
                value={formData.discord}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div>
            <button
              type="button"
              className="flex items-center space-x-1 text-gray-300 hover:text-white"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span>Advanced Options</span>
              <span
                className={`transform transition-transform ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <span>Modify Creator Information</span>
                  <div className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      className="opacity-0 w-0 h-0"
                      checked={modifyCreator}
                      onChange={() => setModifyCreator(!modifyCreator)}
                    />
                    <span
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                        modifyCreator ? "bg-teal-600" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`absolute h-4 w-4 bg-white rounded-full transition-all duration-300 ${
                          modifyCreator ? "left-7" : "left-1"
                        } top-1`}
                      ></span>
                    </span>
                  </div>
                  <span className="text-teal-400">(+0.1 SOL)</span>
                </div>

                {modifyCreator && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="creatorName"
                      placeholder="Creator Name"
                      className="w-full bg-gray-800 rounded p-3 text-white"
                      value={formData.creatorName}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="creatorWebsite"
                      placeholder="Creator Website"
                      className="w-full bg-gray-800 rounded p-3 text-white"
                      value={formData.creatorWebsite}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">❄️</span>
                      <span>Revoke Freeze</span>
                    </div>
                    <span className="text-teal-400">+0.1 SOL</span>
                  </button>

                  <button
                    type="button"
                    className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">🔨</span>
                      <span>Revoke Mint</span>
                    </div>
                    <span className="text-teal-400">+0.1 SOL</span>
                  </button>

                  <button
                    type="button"
                    className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">🔄</span>
                      <span>Revoke Update</span>
                    </div>
                    <span className="text-teal-400">+0.1 SOL</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-6">
            <span>Total Fee: 0.20 SOL</span>
            <button
              type="button"
              className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-3 rounded"
              onClick={createToken}
            >
              Create Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TokenCreator;
