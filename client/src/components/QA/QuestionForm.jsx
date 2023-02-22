import React, { useState, useRef, useCallback } from 'react';
import { addQA } from '../../shared/api.js';

const QuestionForm = ({ product_id, product_name, updateData }) => {
  const formWrapperRef = useRef(null);
  const [formData, setFormData] = useState({ body: '', name: '', email: '' });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const { body, name, email } = formData;
    const questionFormRequest = { product_id, body, name, email };

    addQA(questionFormRequest).then(() => {
      setFormData({ body: '', name: '', email: '' });
      formWrapperRef.current.style.display = 'none';
      updateData();
    });
  }, [formData, product_id, updateData]);

  return (
    <div className="form-wrapper" ref={formWrapperRef}>
      <div className="question-form-container">
        <form onSubmit={handleSubmit} className="question-form">
          <div>
            <p>Ask Your Question</p>
            <i className="fas fa-times"></i>
          </div>
          <h3>About the "{product_name}"</h3>
          <label htmlFor="question-body">
            <p>Your Question :</p>
            <textarea
              id="question-body"
              name="body"
              placeholder="Example: Why did you like the product or not?"
              maxLength="1000"
              required
              value={formData.body}
              onChange={handleChange}
            ></textarea>
          </label>
          <label htmlFor="question-nickname">
            <p>Your nickname :</p>
            <p>
              <input
                id="question-nickname"
                name="name"
                placeholder="Example: jackson11!"
                autoComplete="off"
                required
                value={formData.name}
                onChange={handleChange}
              />
              <span>For privacy reasons, do not use your full name or email address</span>
            </p>
          </label>
          <label htmlFor="question-email">
            <p>Your email :</p>
            <p>
              <input
                type="email"
                id="question-email"
                name="email"
                autoComplete="off"
                placeholder="Example: jack@email.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <span>For authentication reasons, you will not be emailed</span>
            </p>
          </label>

          <button type="submit">SUBMIT</button>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
