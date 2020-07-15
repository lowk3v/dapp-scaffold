import React, { useEffect } from 'react'
import { ethers } from "ethers";
import BurnerProvider from 'burner-provider';
import Web3Modal from "web3modal";
import { TokenBalance, Balance, Address, Wallet } from "."
import { usePoller } from "../hooks"
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button } from 'antd';
import { RelayProvider } from '@opengsn/gsn';

const INFURA_ID = "2717afb6bf164045b5d5468031b93f87"  // MY INFURA_ID, SWAP IN YOURS!

const web3Modal = new Web3Modal({
  //network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID
      }
    }
  }
});

export default function Account(props) {

  const createBurnerIfNoAddress = () => {
    if (!props.injectedProvider && props.localProvider && typeof props.setInjectedProvider == "function"){
      let burnerProvider
      if(props.localProvider.connection && props.localProvider.connection.url){
        burnerProvider = new BurnerProvider(props.localProvider.connection.url)
        console.log("________BY URL",props.localProvider.connection.url)
      }else if( props.localProvider._network && props.localProvider._network.name ){
        burnerProvider = new BurnerProvider("https://"+props.localProvider._network.name+".infura.io/v3/"+INFURA_ID)
        console.log("________INFURA")
      }else{
        console.log("________MAINMIAN")
        burnerProvider = new BurnerProvider("https://mainnet.infura.io/v3/"+INFURA_ID)
      }
      updateProviders(burnerProvider)
    }else{
      pollInjectedProvider()
    }
  }
  useEffect(createBurnerIfNoAddress, [props.injectedProvider]);

  const updateProviders =  async (provider) => {

    props.setInjectedProvider(new ethers.providers.Web3Provider(provider))

    if (typeof props.setMetaProvider == "function" && props.gsnConfig) {
    let gsnConfig = {
      relayHubAddress: props.gsnConfig.relayHubAddress,
      stakeManagerAddress: props.gsnConfig.stakeManagerAddress,
      paymasterAddress: props.gsnConfig.paymasterAddress,
    }

    if (provider._metamask) {
      console.log('using metamask')
      gsnConfig = {...gsnConfig, gasPriceFactorPercent:70, methodSuffix: '_v4', jsonStringifyRequest: true, chainId: provider.networkVersion}

    }

    //if(provider && typeof provider.getNetwork == "function"){
      //hardcode test
    //  console.log("NEED NETWORK ID")
    //  console.log("probably:",provider.networkVersion)
    //  console.log("NETWORK:",await provider.getNetwork())
    //  gsnConfig.chainId = 42
  	 // gsnConfig.relayLookupWindowBlocks= 1e5


    //}else{
      gsnConfig.chainId = 42//31337
  	  gsnConfig.relayLookupWindowBlocks= 1e5
    //}

    console.log("setting gsnConfig",gsnConfig)
    const gsnProvider = new RelayProvider(provider, gsnConfig)
    props.setMetaProvider(new ethers.providers.Web3Provider(gsnProvider))
  }
  }

  const pollInjectedProvider = async ()=>{
    if(props.injectedProvider){
      let accounts = await props.injectedProvider.listAccounts()
      if(accounts && accounts[0] && accounts[0] !== props.account){
        //console.log("ADDRESS: ",accounts[0])
        if(typeof props.setAddress == "function") props.setAddress(accounts[0])
      }
    }
  }
  usePoller(()=>{pollInjectedProvider()},props.pollTime?props.pollTime:1999)

  const loadWeb3Modal = async ()=>{
    const provider = await web3Modal.connect();
    //console.log("GOT CACHED PROVIDER FROM WEB3 MODAL",provider)
    if(typeof props.setInjectedProvider == "function"){
      updateProviders(provider)
    }
    pollInjectedProvider()
  }

  const logoutOfWeb3Modal = async ()=>{
    await web3Modal.clearCachedProvider();
    //console.log("Cleared cache provider!?!",clear)
    setTimeout(()=>{
      window.location.reload()
    },1)
  }

  let modalButtons = []
  if(typeof props.setInjectedProvider == "function"){
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button key="logoutbutton" style={{verticalAlign:"top",marginLeft:8,marginTop:4}} shape={"round"} size={"large"}  onClick={logoutOfWeb3Modal}>logout</Button>
      )
    }else{
      modalButtons.push(
        <Button key="loginbutton" style={{verticalAlign:"top",marginLeft:8,marginTop:4}} shape={"round"} size={"large"} type={props.minimized?"default":"primary"} onClick={loadWeb3Modal}>connect</Button>
      )
    }
  }


  React.useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal()
    }
  }, []);

  const tokenContract = props.localProvider

  let display=""
  display = (
    <span>
      {props.address?(
        <Address value={props.address} ensProvider={props.mainnetProvider}/>
      ):"Connecting..."}
      <Balance address={props.address} provider={props.localProvider} dollarMultiplier={props.price}/>
      <Wallet address={props.address} provider={props.injectedProvider} ensProvider={props.mainnetProvider} price={props.price} />
    </span>)

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
}