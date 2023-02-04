import React, { useEffect, useState } from "react";
import Simplestorage from "./contracts/SimpleStorage.json"; //abi ke import
import Web3 from "web3";

const App = () => {
  const [dynamicInput, setDynamicInput] = useState(0);

  const [inBrowser,setInBrowser] = useState(null)

  const [state, setState] = useState({
    web3: null,
    contract: null,
  });

  const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
  const template = async () => {
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Simplestorage.networks[networkId];
    // console.log(deployedNetwork.address)

    const contract = new web3.eth.Contract(
      Simplestorage.abi,
      deployedNetwork.address
    ); //contract er instance create hoye jabe
    setState({ web3, contract });
  };

  useEffect(() => {
    provider && template();
  }, []);
  console.log(state);

  const getAllAccounts = async () => {
    const { web3 } = state;
    const allAccounts = await web3.eth.getAccounts();
    console.log(allAccounts);
  };

  const readContractVal = async () => {
    const { contract } = state;
    const val = await contract.methods.getter().call();
    console.log(val);
  };

  const WriteContractVal = async () => {
    const { contract } = state;
    await contract.methods
      .setter(dynamicInput)
      .send({ from: "0xD81602415616C2aB0A817F589E5390b55C5c5B0b" });
    const val = await contract.methods.getter().call();
    setInBrowser(val)
  };

  return (
    <div>
      <p className="text-3xl text-blue-800">
        <input
          type="number"
          className="border-black border-2 p-2"
          value={dynamicInput}
          onChange={(e) => setDynamicInput(e.target.value)}
        />
        <button
          className="p-2 bg-green-500 text-blue-800"
          onClick={WriteContractVal}
        >
          Get Accounts
        </button>
        <p>{inBrowser}</p>
      </p>
    </div>
  );
};

export default App;
