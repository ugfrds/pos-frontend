import { useState, useEffect } from 'react';
import {fetchProducts} from '../../../api';

const ProductList = ({ onProductsFetched }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProductsList = async () => {
            try {
                const fetchedProducts = await fetchProducts();
                const productList = fetchedProducts.map(({ id, ...product }) => product); // Exclude the 'id' field
                setProducts(productList);
                if (onProductsFetched) {
                    onProductsFetched(productList);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setProducts([]);
            }
        };

        fetchProductsList();
    }, [onProductsFetched]);

    return products;
};

export default ProductList;