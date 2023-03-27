const Protected = ({ children }) => {

  if (sessionStorage.getItem("loggedInShop") === null) {
    return window.location.replace('http://localhost:3000');
  }
  return children;
};
export default Protected;
