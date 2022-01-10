import React, { useState, useEffect} from 'react';
import NavBar from './NavBar.jsx';
import { OverviewApp } from './overview/OverviewApp.jsx';
import RelatedProductList from './relatedProducts/RelatedProductList.jsx';
import OutfitList from './relatedProducts/OutfitList.jsx';
import QAsection from './QA/QAsection.jsx';
import RnRApp from './R&R/RnRApp.jsx';
import { MainContainer } from '../../dist/RelatedProductStyles';
import { getProducts } from '../shared/api';

const App = function () {

  const [productId, setProductId] = useState(63616);
  const [currentProduct, setCurrentProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllData = () => {
    getProducts({product_id: productId})
      .then((results) => {
        setCurrentProduct(results.data);
        setIsLoading(false);
      })
      .catch(err => { setError(err); })
  };

  useEffect(() => {
    getAllData();
    return () => { document.documentElement.scrollTop = 0 };
  }, [productId])

  if (isLoading) {
    return <img src='https://images.wondershare.com/mockitt/ux-beginner/loading-time-tips.jpeg'/>;
  }

  if (error) {
    return (
      <img src="https://colorlib.com/wp/wp-content/uploads/sites/2/404-error-template-3.png.webp"/>
    );
  }

  return (
    <div>
      <NavBar defaultProductId={setProductId}/>
      <OverviewApp product_id={ productId } currentProduct = { currentProduct } setError={setError}/>
      <MainContainer>
        <RelatedProductList productId={productId} currentProduct={currentProduct} setProductId={setProductId} setError={setError}/>
        <hr/>
        <OutfitList productId={productId} currentProduct={currentProduct} />
        <hr/>
        <QAsection product_id={currentProduct.id} product_name={currentProduct.name} />
        <hr/>
//         <RnRApp productId = {productId} />
      </MainContainer>
    </div>
  )
}

export default App;
