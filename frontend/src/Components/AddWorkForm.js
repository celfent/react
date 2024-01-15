import React, { useState } from 'react';
import './Home.css';
import axios from 'axios';

const AddWorkForm = ({ onClose }) => {
    const [newWork, setNewWork] = useState({
      title: '',
      description: '',
      date: '',
      link: '',
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewWork((prevWork) => ({ ...prevWork, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post("http://localhost:8081/works-insert", newWork)
      .then(res => {
        console.log(res);
        window.location.reload();
      })
      .catch(err => console.log(err));
      onClose();
    };  

  return (
    <div className="modal modal-add" id="modal_add_work">
      <div className="modal__dialog modal__dialog--sm">
        <button className="modal__close" type="button" onClick={onClose}>
          <img src="./close.svg" alt="Close"></img>
        </button>

        <div className="contact">
          <h3 className="modal__title mb-0">Add New Work</h3>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form__group">
              <label className="form__label" htmlFor="input-title">
                Title
              </label>
              <input
                required
                className="form__input"
                type="text"
                id="input-title"
                name="title"
                value={newWork.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="form__group">
              <label className="form__label" htmlFor="input-description">
                Description
              </label>
              <textarea
                required
                className="form__input"
                type="text"
                id="input-description"
                name="description"
                value={newWork.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form__group">
              <label className="form__label" htmlFor="input-link">
                Link
              </label>
              <input
                required
                className="form__input"
                type="text"
                id="input-link"
                name="link"
                value={newWork.link}
                onChange={handleInputChange}
              />
            </div>

            <div className="text-right">
              <button className="btn" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWorkForm;
