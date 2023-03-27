import { useSearchParams } from "react-router-dom";

const Home = () => {
  let [searchParams, setSearchParams] = useSearchParams("");
  if(JSON.parse(searchParams.get("ShopAuth"))){
    const loggedInShopData = JSON.parse(searchParams.get("ShopAuth"));
    sessionStorage.setItem("loggedInShop", JSON.stringify(loggedInShopData));
    setSearchParams();
  }

  return <h1>Welcome to Admin Dashboard</h1>;
};

export default Home;
