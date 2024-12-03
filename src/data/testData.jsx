import React, { useState, useEffect } from 'react';
import { getMenuItems} from '../api/menuApi';


const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);

useEffect(() => {
    const fetchMenuItems = async () => {
      const items = await getMenuItems();
      setMenuItems(items);
    };
    fetchMenuItems();
  }, []);
}