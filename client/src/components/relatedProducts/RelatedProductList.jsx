import React, { useState, useEffect } from 'react';
import RelatedProductCard from './RelatedProductCard.jsx';
import ComparisonModal from './ComparisonModal.jsx';
import { getRelated } from '../../shared/api';
import { getRelatedCards } from './helpers.js';
import { MainContainer, RelatedProducts, CarouselContainer, Carousel, InnerCarousel, Arrow, NoArrow } from '../../../dist/RelatedProductStyles';

const RelatedProductList = ({productId, currentProduct, setProductId}) => {
  let [showModal, setShowModal] = useState(false);
  let [comparisonProduct, setComparisonProduct] = useState({});
  let [relatedProducts, setRelatedProducts] = useState([]);
  let [index, setIndex] = useState(0);
  let [scrollY, setScrollY] = useState(window.scrollY);

  const getRelatedData = () => {
    getRelated({product_id: productId})
      .then((results) => {
        let allCards = getRelatedCards(results.data);
        removeDuplicates(allCards);
      })
      .catch(err => { setError(err); })
  }

  useEffect(() => {
    getRelatedData();
  }, [productId])

  const setModal = (e, product) => {
    e.stopPropagation();
    if (!showModal) {
      setComparisonProduct(product);
    }
    setShowModal(!showModal);
  }

  const removeDuplicates = (products) => {
    let noDuplicates = {};
    let cards = [];
    for (let i = 0; i < products.length; i++) {
      if ((noDuplicates[products[i].id] === undefined)) {
        noDuplicates[products[i].id] = products[i].name;
        cards.push(<RelatedProductCard product={products[i]} key={products[i].id} setProductId={setProductId} setModal={setModal}/>);
      }
    }
    setRelatedProducts(cards);
  }

  const updateIndex = (newIndex) => {
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= relatedProducts.length - 4) {
      newIndex = relatedProducts.length - 4;
    }
    setIndex(newIndex);
  }

  const scroll = () => {
    if (window.scrollY > scrollY) {
      updateIndex(index + 1);
    } else {
      updateIndex(index - 1);
    }
    setScrollY(window.scrollY);
  }

  return (
    <div id='relatedProductSection'>
      <RelatedProducts>RELATED PRODUCTS
        <CarouselContainer>
          {index === 0 ? <NoArrow/> :
          <Arrow
            src='https://img.icons8.com/ios/344/circled-left-2.png'
            aria-label='Scroll left in related products'
            alt=''
            onClick={() => { updateIndex(index - 1); }}
          />}
          <Carousel onWheel={scroll}>
            <InnerCarousel style={{ transform: `translateX(-${index * 25}%)` }}>
              {relatedProducts}
            </InnerCarousel>
          </Carousel>
          {index >= relatedProducts.length - 4 ? <NoArrow/> :
          <Arrow
            src='https://img.icons8.com/ios/344/circled-right-2.png'
            onClick={() => { updateIndex(index + 1); }}
            aria-label='Scroll right in related products'
            alt=''
          />}
        </CarouselContainer>
      </RelatedProducts>
      <ComparisonModal currentProduct={currentProduct} comparisonProduct={comparisonProduct} showModal={showModal} setModal={setModal}/>
    </div>
  );
}

export default RelatedProductList;