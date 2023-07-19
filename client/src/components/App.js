import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Nav from "./Nav";
import ProductPage from "./ProductPage";
import Footer from "./Footer";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Cart from "./Cart";
import ProductForm from "./ProductForm";
import About from "./About";
import Home from "./Home";
import { ErrorProvider } from "../context/errorContext";

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [ filteredItems, setFilteredItems ] = useState([])

  const onSign = (user) => setUser(user);

  useEffect(() => {
    fetch("/products")
    .then(res => res.json())
    .then(data => {
      setProducts(data)
      setFilteredItems(data)
    });
  }, [])



  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      } else {
        setUser(null)
      }
    });
  }, []);


  const addReviewToProduct = (productId, review) => {
    setFilteredItems((products) => products.map(product => {
      if(product.id === productId){
        return {...product, reviews: [...product.reviews, review]}
      }
      return product
     } ))
  
  }

  const deleteItem = (id) => {
    console.log(id)
    const updatedItems = products.filter(product => product.id !== id)
    setProducts(updatedItems)
  }



  return (
    <ErrorProvider>
    <main className="app">
      <Nav user={user} onSign={onSign} />
      <Switch>
        <Route exact path="/signin">
          <SignIn  onSign={onSign}/>
        </Route>
        <Route exact path="/signup">
          <SignUp  onSign={onSign}/>
        </Route>
        <Route exact path="/products">
          <ProductPage products={products} filteredItems={filteredItems} user={user} deleteItem={deleteItem} addReviewToProduct={addReviewToProduct}/>
        </Route>
        <Route exact path='/cartitems'>
          <Cart  product={products}  setOrderItems={setFilteredItems}/>
        </Route>
        <Route path="/products/new">
          <ProductForm />
        </Route >
        <Route exact path='/about'>
          <About />
        </Route>
        <Route exact path='/'>
          <Home />
        </Route>
      </Switch>
      <Footer />
    </main>
    </ErrorProvider>
  );
}

export default App;