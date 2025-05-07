// src/components/ItemButton/ItemButton.jsx
import React from 'react';
import './ItemButton.css';

const ItemButton = ({ imageSrc, onClick }) => {
  return (
    <button className="item-button" onClick={onClick}>
      <img src={imageSrc} alt="Item" />
    </button>
  );
};

export default ItemButton;