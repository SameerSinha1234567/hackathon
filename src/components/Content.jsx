import { useEffect, useState } from 'react';
import axios from 'axios';
import './content.css';

export default function Content() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/items')
      .then(res => {
        console.log("Fetched items:", res.data); 
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });
  }, []);

  return (
    <div className="item-page">
      <h2>Items from MongoDB</h2>
      {items.length === 0 ? (
        <p>Loading or no items found...</p>
      ) : (
        <div className="item-page">
  {items.length === 0 ? (
    <p>Loading or no items found...</p>
  ) : (
    <div className="item-grid">
      {items.map(item => (
        <div key={item._id} className={`item-card ${item.category}-item`}>
          <h3>{item.name}</h3>
          <img src={item.image} alt={item.name} />
          <p className="category">Category: {item.category}</p>
          <p className="price">Price: ₹{item.price}</p>
          <p className="expiry">Expiry: {new Date(item.expiry_date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )}
</div>

      )}
    </div>
  );
}
