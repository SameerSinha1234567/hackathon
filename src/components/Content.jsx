import { useEffect, useState } from 'react';
import axios from 'axios';
import './content.css';

export default function Content() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    category: '',
    price: '',
    expiry_date: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    axios.get('http://localhost:5000/items')
      .then(res => setItems(res.data))
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/items', formData)
      .then(res => {
        setItems(prev => [...prev, res.data]);
        setShowForm(false);
        setFormData({
          name: '',
          image: '',
          category: '',
          price: '',
          expiry_date: '',
        });
      })
      .catch(err => console.error("Post error:", err));
  };
  const handleDelete = (id) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    axios.delete(`http://localhost:5000/items/${id}`)
      .then(() => {
        setItems(prevItems => prevItems.filter(item => item._id !== id));
      })
      .catch(err => console.error("Delete error:", err));
  }
};


  if (loading) return <p style={{ padding: '20px' }}>Loading items...</p>;

  return (
    <div className="item-page">
      <h2>Items from MongoDB</h2>
      <div className="item-grid">
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          items.map(item => (
            <div key={item._id} className={`item-card ${item.category}-item`}>
              <h3>{item.name}</h3>
              <img src={item.image} alt={item.name} />
              <p className="category">Category: {item.category}</p>
              <p className="price">Price: ₹{item.price}</p>
              <p className="expiry">Expiry: {new Date(item.expiry_date).toLocaleDateString()}</p>
              <button className="delete-btn"onClick={() => handleDelete(item._id)}> Delete</button>
            </div>  
          ))
        )}
      </div>

      <button onClick={() => setShowForm(prev => !prev)} className="add-btn">
        {showForm ? 'Close Form' : 'Add Item'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="add-item-form">
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <input name="expiry_date" type="date" placeholder="Expiry Date" value={formData.expiry_date} onChange={handleChange} required />
          <button type="submit" className="btn">Submit</button>
        </form>
      )}
    </div>
  );
}
